# 🏸 Cầu Lông Manager

Ứng dụng quản lý buổi đánh cầu lông — xếp đội, theo dõi round, tính tiền.

## 🛠️ Tech Stack

| Công cụ | Mục đích |
|---------|----------|
| **React 18** | UI framework, component-based |
| **Vite 5** | Build tool siêu nhanh, hot reload |
| **Zustand** | State management đơn giản + persist localStorage |
| **Lucide React** | Icon set đẹp |

---

## 📦 Cài đặt trên máy tính

### Bước 1 — Cài Node.js

Tải và cài từ: https://nodejs.org  
Chọn bản **LTS** (ví dụ: 20.x hoặc 22.x)

Kiểm tra sau khi cài:
```bash
node -v   # phải thấy v18+ hoặc v20+
npm -v    # phải thấy 9+
```

---

### Bước 2 — Mở project trong VS Code

1. Giải nén file `caulong-app.zip` vào một thư mục (ví dụ: `D:\caulong`)
2. Mở **Visual Studio Code**
3. Vào **File → Open Folder** → chọn thư mục vừa giải nén

---

### Bước 3 — Cài dependencies

Mở terminal trong VS Code:
- Nhấn **Ctrl + `** (backtick) hoặc vào **Terminal → New Terminal**

Chạy lệnh:
```bash
npm install
```

Chờ khoảng 30–60 giây để tải các package.

---

### Bước 4 — Chạy app

```bash
npm run dev
```

Vite sẽ khởi động và hiển thị:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Mở trình duyệt → vào **http://localhost:5173**

---

### Bước 5 — Mở trên điện thoại (cùng WiFi)

Dùng địa chỉ `Network` ở trên, ví dụ:  
`http://192.168.1.5:5173`

Nhập địa chỉ này vào Safari/Chrome trên iPhone.

---

## 🏗️ Build cho production (tùy chọn)

```bash
npm run build
```

Output sẽ ra thư mục `dist/` — có thể host lên GitHub Pages, Netlify, v.v.

---

## 📁 Cấu trúc file

```
caulong/
├── index.html                  # HTML entry point
├── vite.config.js              # Cấu hình Vite
├── package.json                # Dependencies
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component, routing tab
    │
    ├── styles/
    │   └── global.css          # CSS variables, reset, utilities
    │
    ├── store/
    │   └── useStore.js         # Zustand store (state + actions + localStorage)
    │
    ├── utils/
    │   └── helpers.js          # Parse tên, tính số, cảnh báo round
    │
    ├── hooks/
    │   └── useToast.js         # Toast notification hook
    │
    └── components/
        ├── Header.jsx           # Top header
        ├── TabBar.jsx           # Bottom navigation tabs
        ├── Toast.jsx            # Toast UI
        ├── SetupPage.jsx        # Tab 1: Nhập session, danh sách người
        ├── CourtCard.jsx        # Component sân đánh
        ├── PlayerPickerModal.jsx # Modal chọn người vào slot
        ├── TeamsPage.jsx        # Tab 2: Xếp đội, round
        └── PaymentPage.jsx      # Tab 3: Tính tiền, xuất kết quả
```

---

## 🧩 Extensions VS Code nên cài

Tìm trong Extensions (Ctrl+Shift+X):

- **ES7+ React/Redux/React-Native snippets** — snippets cho React
- **Prettier - Code formatter** — format code tự động
- **ESLint** — kiểm tra lỗi code
- **vscode-styled-components** — highlight CSS-in-JS
- **GitLens** — quản lý Git tiện hơn

---

## 💾 Dữ liệu

Toàn bộ dữ liệu được lưu trong `localStorage` của trình duyệt dưới key `caulong-v2`.  
Không cần internet sau khi tải lần đầu.

Để xóa dữ liệu: Nhấn **RESET SESSION** trong app, hoặc mở DevTools → Application → localStorage → xóa key `caulong-v2`.
