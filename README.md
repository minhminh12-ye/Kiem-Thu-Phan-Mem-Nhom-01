HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG DỰ ÁN - NHÓM 01
Chào các thành viên nhóm 01, đây là quy trình để đưa dự án về máy cá nhân và bắt đầu viết kịch bản kiểm thử. Các cậu hãy làm đúng theo từng bước dưới đây nhé!

1. Chuẩn bị công cụ (Bắt buộc phải cài)
Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đủ 4 phần mềm sau:
Git: (https://git-scm.com/) (Để tải code).
Node.js (LTS): (https://nodejs.org/fr/download)(Để chạy web).
XAMPP: Tải để chạy Database.
Python 3.10+: Tải để chạy Robot Framework.

2. Cách tải mã nguồn về máy
Mở thư mục trên máy tính nơi cậu muốn để dự án.
Nhấn chuột phải chọn Open in Terminal (hoặc mở Command Prompt).
Gõ lệnh sau và nhấn Enter:
git clone https://github.com/minhminh12-ye/Kiem-Thu-Phan-Mem-Nhom-01.git
cd Kiem-Thu-Phan-Mem-Nhom-01
Mở thư mục vừa tải về bằng Visual Studio Code.

3. Thiết lập Cơ sở dữ liệu (MySQL)
Mở XAMPP Control Panel, nhấn Start cho cả Apache và MySQL.
Mở trình duyệt, truy cập địa chỉ: http://localhost/phpmyadmin/.
Nhấn vào nút Mới (New) ở cột trái -> Tạo database tên chính xác là: webbanhang.
Chọn database webbanhang vừa tạo -> Nhấn tab Import (Nhập) ở menu trên cùng.
Nhấn Choose File, tìm đến file webbanhang.sql trong thư mục dự án cậu vừa tải về.
Kéo xuống dưới cùng nhấn nút Import (Nhập).

4. Cách chạy Website (Phải chạy web thì mới Test được)
Bước 1: Chạy Backend
Mở Terminal trong VS Code (Ctrl + `).
Gõ các lệnh sau:
cd backend
npm install
npm start
(Khi nào hiện "Kết nối thành công đến MySQL" là OK).

Bước 2: Chạy Frontend
Bấm vào dấu [+] ở góc Terminal để mở tab mới.
Gõ các lệnh sau:
cd frontend
npm install
npm start
(Website sẽ tự động mở tại: http://localhost:3000 hoặc 3001/3002).

5. Cách chạy Robot Framework (Để làm kiểm thử)
Bước 1: Cài đặt môi trường ảo (Chỉ làm 1 lần duy nhất)
Mở một tab Terminal mới (đứng ở thư mục gốc của dự án) và gõ:
python -m venv venv
.\venv\Scripts\activate
pip install robotframework robotframework-seleniumlibrary robotframework-requests

Bước 2: Viết kịch bản của cậu
Cậu hãy tạo file .robot trong thư mục backend/tests (Ví dụ: Tên_Login.robot).

Bước 3: Chạy kịch bản
Gõ lệnh này để chạy file của cậu:
Ví dụ chạy file Tên_Login.robot: robot backend/tests/Tên_Login.robot 
(Kết quả sẽ nằm trong file report.html. Cậu mở nó bằng Chrome để xem báo cáo).

🤝 6. Quy trình làm việc nhóm trên GitHub
Mỗi khi viết xong kịch bản hoặc sửa lỗi, các cậu dùng 3 lệnh sau để đẩy code lên cho cả nhóm thấy:
git add .
git commit -m "Ghi chú nội dung cậu đã làm"
git push
Lưu ý: Trước khi bắt đầu làm việc, hãy gõ git pull để lấy những gì mới nhất mà các bạn khác đã up lên nhé!
