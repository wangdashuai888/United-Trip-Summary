# 🛫 United Trip Summary Renderer (Tampermonkey Script)

This userscript enhances the United Airlines website by extracting detailed booking and flight information from `/api/myTrips/lookup` and displaying it in a structured summary format.

## ✨ Features

- Automatically intercepts and parses booking JSON after PNR lookup
- Displays a clean summary of:
  - Flight segments
  - Tickets and coupons
  - Passengers and loyalty tier
  - SSRs (Special Service Requests)
  - PNR remarks
- Toggle button to view the raw JSON for inspection or debugging

## 🔧 Parsing Reference

The data parsing logic was adapted and inspired by [@iangcarroll's `pnrsh`](https://github.com/iangcarroll/pnrsh), which defines a clean schema for flights, passengers, SSRs, and ticket data structures.

## 🙌 Credits

- JSON interception idea and JSON sample courtesy of @mrmitchelldevis
- Script development assisted by [ChatGPT (OpenAI)](https://openai.com/chatgpt)
- Author: **wangdashuai888** 

## ▶️ Usage

1. Install **Tampermonkey** or a similar userscript manager in your browser.
2. Add the script [united-trip-summary.user.js](./united-trip-summary.user.js) to your manager.
3. Visit [united.com](https://www.united.com), enter a valid PNR (booking reference), and perform a lookup.
4. Upon successful response, a summary box will appear at the top of the page showing detailed flight and ticket information.
5. Use the **"🔄 Toggle: Show Raw JSON"** button to inspect the raw data.

## 📷 Screenshot


---

Feel free to submit PRs or open issues if you'd like to expand this further (e.g., export to PDF, print view, etc.)
