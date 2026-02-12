# LibreTTS - 在线文本转语音工具

LibreTTS 是一款免费的在线文本转语音工具，支持多种声音选择，可调节语速和语调，提供即时试听和下载功能。

> 本项目曾用名 Ciallo TTS。

## 功能特点

- 🎯 支持超过300种不同语言和口音的声音
- 🔊 实时预览和试听功能
- ⚡ 支持长文本自动分段处理
- 🎛️ 可调节语速和语调
- 📱 响应式设计，支持移动端
- 💾 支持音频下载
- 📝 历史记录功能（最多保存50条）
- 🔌 支持添加自定义OpenAI格式的TTS API

## API 说明

本项目提供以下 API 端点:

### OpenAI 兼容 API 路径 ⭐

- `/v1/audio/speech` - OpenAI 兼容的文本转语音 API
  - 支持 POST 方法
  - 兼容 OpenAI TTS API 格式，可直接用于 Open WebUI 等支持 OpenAI API 的应用
  - 请求示例:
    ```bash
    curl -X POST "https://your-domain.com/v1/audio/speech" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "tts-1",
        "input": "你好，世界！",
        "voice": "zh-CN-XiaoxiaoNeural",
        "speed": 1.0,
        "response_format": "mp3"
      }' -o output.mp3
    ```
  - 参数说明:
    - `model`: 模型名称（如 `tts-1`，当前被忽略但保留以兼容 OpenAI 格式）
    - `input`: 要转换的文本内容（必需）
    - `voice`: 语音名称，如 `zh-CN-XiaoxiaoNeural`（默认：`zh-CN-XiaoxiaoMultilingualNeural`）
    - `speed`: 语速，范围 0.25 到 4.0（默认：1.0）
    - `response_format`: 音频格式，支持 `mp3`、`opus`、`wav`、`pcm` 等（默认：`mp3`）

### Azure TTS API 路径

- `/api/azure-tts` - Azure 认知服务文本转语音 API
  - 通过 Cloudflare Pages Function 后端代理转发请求，API 密钥安全存储在服务端
  - 支持 SSML 格式，可精细控制语速和语调
  - 需要在 Cloudflare Pages 中配置 `AZURE_TTS_KEY` 和 `AZURE_TTS_REGION` 环境变量
  - 支持多语言语音：中文、英文、日文等

### Edge API 路径

- `/api/tts` - 文本转语音 API
  - 支持 GET/POST 方法
  - GET 示例: `/api/tts?t=你好世界&v=zh-CN-XiaoxiaoNeural&r=0&p=0`
  - POST 示例: 请求体为JSON格式 `{"text": "你好世界", "voice": "zh-CN-XiaoxiaoNeural", "rate": 0, "pitch": 0}`

- `/api/voices` - 获取可用语音列表 API
  - 仅支持 GET 方法
  - 示例: `/api/voices?l=zh&f=1` (l参数用于筛选语言，f参数指定返回格式)

例如：`https://libretts.is-an.org/api/tts`

### 自定义 API

LibreTTS 支持添加自定义 API 端点，目前支持两种格式：

#### OpenAI 格式 API

- 支持与 OpenAI TTS API 兼容的服务，如 OpenAI、LMStudio、LocalAI 等
- 请求格式: POST
  ```json
  {
    "model": "tts-1",
    "input": "您好，这是一段测试文本",
    "voice": "alloy",
    "response_format": "mp3"
  }
  ```
- 可选参数：`instructions` - 语音风格指导

#### Edge 格式 API

- 支持与 Microsoft Edge TTS API 兼容的服务
- 请求格式: POST
  ```json
  {
    "text": "您好，这是一段测试文本",
    "voice": "zh-CN-XiaoxiaoNeural",
    "rate": 0,
    "pitch": 0
  }
  ```

#### 如何添加自定义 API

1. 点击界面上的"管理API"按钮
2. 填写以下信息：
   - API 名称：自定义名称
   - API 端点：语音生成服务地址
   - API 密钥：可选，用于授权
   - 模型列表端点：可选，用于获取可用模型
   - API 格式：选择 OpenAI 或 Edge 格式
   - 手动输入讲述人列表：逗号分隔的讲述人列表
   - 最大文本长度：可选，限制单次请求的文本长度

3. 点击"获取模型"按钮可自动填充可用讲述人列表
4. 点击"保存"完成添加

#### 导入/导出 API 配置

- 导出：将所有自定义 API 配置导出为 JSON 文件
- 导入：从 JSON 文件导入 API 配置

### Open WebUI 配置指南

LibreTTS 现已支持 OpenAI 兼容的 API 格式，可直接集成到 Open WebUI 中使用：

#### 配置步骤

1. **登录 Open WebUI**，进入设置页面

2. **导航到音频设置**：
   - 点击左侧菜单的 "Settings"（设置）
   - 找到 "Audio" 或 "Text-to-Speech" 相关选项

3. **配置 TTS API**：
   - **API URL**: `https://your-domain.com/v1/audio/speech`（替换为你的实际域名）
   - **API Key**: （可选，如果你的部署设置了访问密码）
   - **Model**: `tts-1`
   - **Voice**: 选择你喜欢的语音，如 `zh-CN-XiaoxiaoNeural`

4. **常用中文语音选项**：
   - `zh-CN-XiaoxiaoNeural` - 晓晓（女声，自然）
   - `zh-CN-YunxiNeural` - 云希（男声）
   - `zh-CN-XiaoyiNeural` - 晓伊（女声）
   - `zh-CN-YunjianNeural` - 云健（男声）
   - `zh-CN-liaoning-XiaobeiNeural` - 晓北（女声，东北口音）

5. **测试配置**：
   - 在 Open WebUI 的聊天界面中，启用 TTS 功能
   - 发送一条消息，检查是否能正常播放语音

#### 配置示例

如果你的 LibreTTS 部署在 `https://libretts.example.com`，那么配置如下：

```
TTS API URL: https://libretts.example.com/v1/audio/speech
Voice: zh-CN-XiaoxiaoNeural
Speed: 1.0 (可在 0.25-4.0 之间调整)
```

#### 注意事项

- 确保你的 LibreTTS 服务已部署并可公网访问
- 如果设置了访问密码（PASSWORD 环境变量），需要在 Open WebUI 中配置 API Key
- 建议先使用 curl 命令测试 API 是否正常工作：
  ```bash
  curl -X POST "https://your-domain.com/v1/audio/speech" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "tts-1",
      "input": "测试语音",
      "voice": "zh-CN-XiaoxiaoNeural"
    }' -o test.mp3
  ```

## 部署指南

### Vercel 部署

1. Fork 本仓库到你的 GitHub 账号

2. 登录 [Vercel](https://vercel.com/)，点击 "New Project"

3. 导入你 fork 的仓库，并选择默认设置部署即可

4. 部署完成后，你会获得一个 `your-project.vercel.app` 的域名

### Cloudflare Pages 部署

1. Fork 本仓库到你的 GitHub 账号

2. 登录 Cloudflare Dashboard，进入 Pages 页面

3. 创建新项目，选择从 Git 导入：
   - 选择你 fork 的仓库
   - 构建设置：
     - 构建命令：留空
     - 输出目录：`/`

4. 如需启用 Azure TTS 功能，在 Cloudflare Pages 项目设置中添加环境变量：
   - 进入 **Settings** > **Environment variables**
   - 添加以下变量（生产环境和预览环境均需设置）：
     - `AZURE_TTS_KEY`：你的 Azure 语音服务订阅密钥
     - `AZURE_TTS_REGION`：Azure 服务区域，如 `eastus`（默认值为 `eastus`）
   - 保存后需重新部署才能生效

5. 部署完成后，你会获得一个 `xxx.pages.dev` 的域名

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `PASSWORD` | 否 | 访问密码，设置后用户首次访问需输入密码验证 |
| `AZURE_TTS_KEY` | 否 | Azure 语音服务订阅密钥，启用 Azure TTS 功能时需设置 |
| `AZURE_TTS_REGION` | 否 | Azure 服务区域（默认：`eastus`），启用 Azure TTS 功能时需设置 |

### Azure 语音服务密钥获取方式

1. 登录 [Azure Portal](https://portal.azure.com/)
2. 创建 **语音服务**（Speech Services）资源
3. 在资源的 **密钥和终结点** 页面获取 `KEY 1` 或 `KEY 2` 和 `位置/区域`
4. 将密钥填入 Cloudflare Pages 环境变量 `AZURE_TTS_KEY`，区域填入 `AZURE_TTS_REGION`

> Azure 语音服务提供免费层（F0），每月可免费合成 50 万字符。

[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")
# LibreTTS
