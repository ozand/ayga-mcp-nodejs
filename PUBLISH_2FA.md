# 🔐 npm Publish with 2FA

## Текущая ситуация

- ✅ GitHub репозиторий: https://github.com/ozand/ayga-mcp-nodejs
- ✅ Release v2.0.0: создан
- ✅ npm login: выполнен
- ⚠️ npm publish: требует 2FA OTP код

## Публикация с 2FA

### Вариант 1: С OTP кодом (рекомендуется)

```bash
cd T:\Code\python\A-PARSER\ayga-mcp-nodejs

# Получить OTP код из authenticator app (Google Authenticator, Authy, etc.)
# Затем:
npm publish --access public --otp=123456
```

Где `123456` - текущий 6-значный код из вашего authenticator app.

### Вариант 2: Создать Automation Token

1. Зайти на https://www.npmjs.com/settings/ozand/tokens
2. Generate New Token → Type: **Automation**
3. Скопировать новый токен
4. Использовать:

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_AUTOMATION_TOKEN
npm publish --access public
```

### Вариант 3: Временно отключить 2FA (не рекомендуется)

1. https://www.npmjs.com/settings/ozand/profile
2. Two-Factor Authentication → Disable
3. `npm publish --access public`
4. Включить 2FA обратно

## После успешной публикации

```bash
# Проверить публикацию
npm view @ayga/mcp-client

# Тест установки
npx @ayga/mcp-client@latest

# Обновить README с npm ссылкой
```

## Быстрая команда (скопируйте и замените OTP)

```bash
cd T:\Code\python\A-PARSER\ayga-mcp-nodejs
npm publish --access public --otp=YOUR_6_DIGIT_CODE
```

## Ожидаемый результат

```
npm notice Publishing to https://registry.npmjs.org/
+ @ayga/mcp-client@2.0.0
✓ Package published successfully

View at:
https://www.npmjs.com/package/@ayga/mcp-client
```

---

**Текущий статус**: Ожидает OTP код для публикации

**Команда готова**: `npm publish --access public --otp=XXXXXX`
