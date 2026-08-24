param(
  [string]$InputDirectory = (Join-Path $PSScriptRoot '..\work\business-pdf-pages'),
  [string]$OutputFile = (Join-Path $PSScriptRoot '..\work\business-ocr-pages.json')
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime] | Out-Null

function Wait-WinRt {
  param(
    [Parameter(Mandatory)] $Operation,
    [Parameter(Mandatory)] [Type] $ResultType
  )

  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object {
      $_.Name -eq 'AsTask' -and
      $_.IsGenericMethod -and
      $_.GetGenericArguments().Count -eq 1 -and
      $_.GetParameters().Count -eq 1
    } |
    Select-Object -First 1

  $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $task.Wait()
  return $task.Result
}

$language = [Windows.Globalization.Language]::new('ja')
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
if (-not $engine) {
  throw 'Windows Japanese OCR engine is not available.'
}

$pages = [System.Collections.Generic.List[object]]::new()
$files = Get-ChildItem -LiteralPath $InputDirectory -Filter 'page-*.jpg' | Sort-Object Name

foreach ($file in $files) {
  $storageFile = Wait-WinRt ([Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName)) ([Windows.Storage.StorageFile])
  $stream = Wait-WinRt ($storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  try {
    $decoder = Wait-WinRt ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Wait-WinRt ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    try {
      $result = Wait-WinRt ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
      $pageNumber = [int]([regex]::Match($file.BaseName, '\d+').Value)
      $lineObjects = @($result.Lines | ForEach-Object {
        $ocrLine = $_
        $words = @($ocrLine.Words)
        if ($words.Count -gt 0 -and $ocrLine.Text.Trim()) {
          [ordered]@{
            text = $ocrLine.Text.Trim()
            x = [math]::Round($words[0].BoundingRect.X, 2)
            y = [math]::Round(($words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum, 2)
          }
        }
      } | Where-Object { $_ })
      $lines = @($lineObjects | Sort-Object y, x | ForEach-Object { $_.text })
      $pages.Add([ordered]@{
        page = $pageNumber
        image = "/business-japanese-v2/$($file.Name)"
        text = ($lines -join "`n")
        lines = $lineObjects
      })
      Write-Progress -Activity 'Japanese OCR' -Status "$pageNumber / $($files.Count)" -PercentComplete (($pageNumber / $files.Count) * 100)
    }
    finally {
      if ($bitmap) { $bitmap.Dispose() }
    }
  }
  finally {
    if ($stream) { $stream.Dispose() }
  }
}

$pages | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $OutputFile -Encoding utf8
Write-Output "OCR_COMPLETE pages=$($pages.Count) output=$OutputFile"
