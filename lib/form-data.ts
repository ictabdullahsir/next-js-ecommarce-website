export const formText = (formData: FormData, key: string, max = 500) =>
  String(formData.get(key) ?? '')
    .trim()
    .slice(0, max)

export const formList = (formData: FormData, key: string, maxItems = 30) =>
  formText(formData, key, 1000)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, maxItems)

export const isSafeImagePath = (value: string) => /^(\/[\w\-./]+|https:\/\/[^\s"'<>]+)$/.test(value)
