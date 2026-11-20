import { createCn } from "cn/config"

// Without this, merge treats `text-section` as a color: it drops it next to `text-ink` and keeps shadcn's `text-base`.
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: ["hero", "section", "card-title", "body", "caption"] }] } },
})
