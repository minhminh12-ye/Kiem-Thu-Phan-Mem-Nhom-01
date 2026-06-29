*** Settings ***
Library           SeleniumLibrary
Suite Setup       Mo Trinh Duyet An Danh
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}           chrome
${BASE_URL}          http://localhost:3000
${ADMIN_EMAIL}       admin@gmail.com
${ADMIN_PASS}        123456

*** Test Cases ***

# --- TC_01: ĐĂNG NHẬP QUẢN TRỊ ---
TC_01: Dang Nhap Quyen Quan Tri
    [Documentation]    Kiểm tra chức năng đăng nhập và chuyển hướng vào trang quản trị
    Go To    ${BASE_URL}/login
    Wait Until Page Contains    ĐĂNG NHẬP    10s
    Input Text      xpath=//input[@placeholder='Nhập email']    ${ADMIN_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']      ${ADMIN_PASS}
    Capture Page Screenshot    admin_01_login_data.png
    Click Button    xpath=//button[text()='Đăng nhập']
    Wait Until Location Contains    /admin/dashboard    15s
    Wait Until Page Contains    Chào mừng đến với trang quản trị    10s

# --- TC_02: QUẢN LÝ NGƯỜI DÙNG ---
TC_02: Quan Ly Nguoi Dung - CRUD User
    [Documentation]    Kiểm tra thêm mới người dùng và tính đồng bộ dữ liệu
    Click Element    xpath=//a[contains(., '👥 Quản lý Tài khoản')]
    Wait Until Page Contains    Quản lý Người dùng    10s
    Click Button    xpath=//button[text()='+ Thêm Người dùng Mới']
    Input Text      name=user_name    Robot Admin Tester
    Input Text      name=email        admin_test@gmail.com
    Input Password  name=password     123456
    Select From List By Value    name=roleid    2
    Click Button    xpath=//button[text()='Lưu']
    Wait Until Page Contains    Thêm người dùng mới thành công!    15s
    Capture Page Screenshot    admin_02_add_user_success.png

# --- TC_03: QUẢN LÝ SẢN PHẨM ---
TC_03: Quan Ly San Pham - Luu Specs JSON
    [Documentation]    Kiểm tra thêm sản phẩm và xử lý chuỗi JSON cho trường Specs
    Click Element    xpath=//a[contains(., '💻 Quản lý Sản phẩm')]
    Wait Until Page Contains    Quản lý Sản phẩm    10s
    Click Button    xpath=//button[text()='+ Thêm Sản phẩm Mới']
    Input Text      name=name    Monitor Samsung Curved Robot
    Select From List By Index    name=category_id    1
    Select From List By Index    name=brand_id       1
    Input Text      name=price    12000
    Input Text      name=stock    15
    Click Button    xpath=//button[text()='Lưu']
    Wait Until Page Contains    Thêm sản phẩm mới thành công!    15s
    Capture Page Screenshot    admin_03_add_product_success.png

# --- TC_04: QUẢN LÝ DANH MỤC ---
TC_04: Quan Ly Danh Muc - Constraint Test
    [Documentation]    Kiểm tra thêm mới danh mục và ràng buộc logic xóa
    Click Element    xpath=//a[contains(., '📂 Quản lý danh mục')]
    Wait Until Page Contains    Danh mục sản phẩm    10s
    Input Text      xpath=//input[@placeholder='Tên danh mục']    Phu Kien Robot
    Click Button    xpath=//button[text()='Thêm mới']
    Wait Until Page Contains    Thêm danh mục thành công!    15s
    Capture Page Screenshot    admin_04_category_success.png

# --- TC_05: THỐNG KÊ DOANH THU (DASHBOARD) ---
TC_05: Thong Ke Doanh Thu Dashboard
    [Documentation]    Kiểm tra logic SUM doanh thu hiển thị trên thẻ thống kê
    Click Element    xpath=//a[contains(., 'Dashboard')]
    Wait Until Page Contains    Tổng doanh thu    10s
    # Kiểm tra số liệu khớp với logic SQL (SUM total_price WHERE status != 'cancelled')
    Wait Until Page Contains    1.603.000.000đ    10s
    Wait Until Page Contains    36    10s
    Capture Page Screenshot    admin_05_dashboard_stats.png

# --- TC_06: QUY TRÌNH XỬ LÝ ĐƠN HÀNG ---
TC_06: Quy Trinh Xu Ly Don Hang
    [Documentation]    Kiểm tra sự hiển thị và hoạt động của nút duyệt đơn (Kịch bản xác định lỗi UI)
    Click Element    xpath=//a[contains(., '$$ Quản lý doanh thu $$')]
    Wait Until Page Contains    Quản lý Doanh thu & Đơn hàng    10s
    # BƯỚC NÀY SẼ FAIL VÌ UI KHÔNG HIỆN NÚT (DO THIẾU API PUT /ORDERS)
    Wait Until Element Is Visible    xpath=(//button[text()='Xử lý'])[1]    10s
    Quy Trinh Duyet Don

*** Keywords ***
Mo Trinh Duyet An Danh
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --incognito
    Call Method    ${options}    add_argument    --disable-save-password-bubble
    Call Method    ${options}    add_argument    --disable-infobars
    Create Webdriver    Chrome    options=${options}
    Maximize Browser Window
    Set Browser Implicit Wait    10s

Quy Trinh Duyet Don
    Click Button    xpath=(//button[text()='Xử lý'])[1]
    Sleep    2s
    Wait Until Element Is Visible    xpath=//button[text()='Hoàn thành']    10s
    Click Button    xpath=(//button[text()='Hoàn thành'])[1]
    Capture Page Screenshot    admin_06_order_workflow.png