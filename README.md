# ひびき · 个人日语精听 MVP

个人日语学习网页，支持本地运行，并通过 GitHub Pages 发布为纯静态网站。

## 本地启动

当前电脑可以直接双击项目根目录中的 `启动网站.bat`。它会自动进入正确目录并打开浏览器，无需在 PowerShell 中输入命令。

通用启动方式：

1. 安装 Node.js 20 或更高版本。
2. 在项目目录打开终端，运行 `npm install`。
3. 运行 `npm run dev`。
4. 浏览器打开 `http://localhost:3000`。

生词和学习进度保存在当前浏览器的本地存储中，不使用数据库、登录或云端账号。

## GitHub Pages

推送到 `main` 分支后，GitHub Actions 会自动生成并发布纯静态网页。仓库名为 `hou-japanese` 时，访问地址为：

`https://lacey007.github.io/hou-japanese/`

首次使用时，在仓库的 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**。

## 内容与音频

示例资料位于 `lib/content.ts`。基础精听课程使用仓库中的本地 MP3；《実用ビジネス日本語》使用浏览器或操作系统自带的日语语音。不同手机和电脑可用的男女声会有所不同。
