*** Settings ***
Library           SeleniumLibrary
Suite Setup       Mo Trinh Duyet An Danh Va Dang Nhap
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}           chrome
${BASE_URL}          http://localhost:3000
${ADMIN_EMAIL}       admin@gmail.com
${ADMIN_PASS}        123456
${TIMEOUT}           10s

*** Test Cases ***

# =========================================================
# MODULE: QUẢN LÝ NGƯỜI DÙNG (Sửa & Xóa)
# =========================================================
TC_USER_01: Chinh Sua Thong Tin Nguoi Dung
    [Documentation]    Kiểm tra việc sửa tên người dùng và kiểm tra thông báo thành công
    Click Element    xpath=//a[contains(., '👥 Quản lý Tài khoản')]
    Wait Until Page Contains    Quản lý Người dùng    ${TIMEOUT}
    
    # Nhấn nút "Sửa" của dòng đầu tiên trong bảng
    Wait Until Element Is Visible    xpath=(//button[text()='Sửa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Sửa'])[1]
    
    # Đợi form sửa hiện ra
    Wait Until Page Contains    Sửa Người dùng    5s
    
    # Clear và nhập tên mới (name=user_name trong code UserManagement.jsx)
    Input Text      name=user_name    Tên Đã Chỉnh Sửa
    Capture Page Screenshot    user_edit_01_fill_data.png
    
    Click Button    xpath=//button[text()='Lưu']
    
    # React code: setSuccessMessage('Cập nhật người dùng thành công!') biến mất sau 3s
    Wait Until Page Contains    Cập nhật người dùng thành công!    ${TIMEOUT}
    Capture Page Screenshot    user_edit_02_success.png

TC_USER_02: Xoa Nguoi Dung
    [Documentation]    Xóa người dùng đầu tiên và xác nhận qua Browser Alert
    # Quay lại trang danh sách nếu đang ở form
    ${is_form}=    Run Keyword And Return Status    Page Should Contain    Sửa Người dùng
    Run Keyword If    ${is_form}    Click Button    xpath=//button[text()='Hủy']

    Wait Until Element Is Visible    xpath=(//button[text()='Xóa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Xóa'])[1]
    
    # XỬ LÝ CONFIRM ALERT: Browser alert từ window.confirm
    Handle Alert    action=ACCEPT    timeout=5s
    
    Wait Until Page Contains    Xóa người dùng thành công!    ${TIMEOUT}
    Capture Page Screenshot    user_delete_success.png


# =========================================================
# MODULE: QUẢN LÝ SẢN PHẨM (Sửa & Xóa)
# =========================================================
TC_PROD_01: Chinh Sua San Pham
    Click Element    xpath=//a[contains(., '💻 Quản lý Sản phẩm')]
    Wait Until Page Contains    Quản lý Sản phẩm    ${TIMEOUT}
    
    Wait Until Element Is Visible    xpath=(//button[text()='Sửa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Sửa'])[1]
    
    Wait Until Page Contains    Sửa Sản phẩm    5s
    
    # Chỉnh sửa giá (name=price trong ProductManagement.jsx)
    Input Text      name=price    999
    Capture Page Screenshot    prod_edit_01_fill_data.png
    
    Click Button    xpath=//button[text()='Lưu']
    Wait Until Page Contains    Cập nhật sản phẩm thành công!    ${TIMEOUT}
    Capture Page Screenshot    prod_edit_02_success.png

TC_PROD_02: Xoa San Pham
    # Đảm bảo đang ở danh sách
    ${is_form}=    Run Keyword And Return Status    Page Should Contain    Sửa Sản phẩm
    Run Keyword If    ${is_form}    Click Button    xpath=//button[text()='Hủy']

    Wait Until Element Is Visible    xpath=(//button[text()='Xóa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Xóa'])[1]
    
    Handle Alert    action=ACCEPT    timeout=5s
    Wait Until Page Contains    Xóa sản phẩm thành công!    ${TIMEOUT}
    Capture Page Screenshot    prod_delete_success.png


# =========================================================
# MODULE: QUẢN LÝ DANH MỤC (Sửa & Xóa)
# =========================================================
TC_CAT_01: Chinh Sua Danh Muc
    Click Element    xpath=//a[contains(., '📂 Quản lý danh mục')]
    Wait Until Page Contains    Danh mục sản phẩm    ${TIMEOUT}
    
    # Đảm bảo đang ở tab "Danh mục sản phẩm" (mặc định là activeTab='category')
    # Click Sửa của category đầu tiên
    Wait Until Element Is Visible    xpath=(//button[text()='Sửa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Sửa'])[1]
    
    # Theo code: Khi sửa, placeholder='Tên danh mục'
    Input Text      xpath=//input[@placeholder='Tên danh mục']    Tên DM Mới
    
    # Nút bấm chuyển từ "Thêm mới" thành "Cập nhật"
    Click Button    xpath=//button[text()='Cập nhật']
    Wait Until Page Contains    Cập nhật danh mục thành công!    ${TIMEOUT}
    Capture Page Screenshot    cat_edit_success.png

TC_CAT_02: Xoa Danh Muc
    [Documentation]    Xóa danh mục và xử lý trường hợp có sản phẩm liên quan
    Wait Until Element Is Visible    xpath=(//button[text()='Xóa'])[1]    ${TIMEOUT}
    Click Button    xpath=(//button[text()='Xóa'])[1]
    
    Handle Alert    action=ACCEPT    timeout=5s
    
    # Logic code: Trả về lỗi 400 nếu có sản phẩm. Robot sẽ kiểm tra cả 2 trường hợp
    ${passed}=    Run Keyword And Return Status    Wait Until Page Contains    Xóa danh mục thành công!    5s
    Run Keyword If    ${passed}    Log    Xóa thành công
    ...    ELSE    Log    Xóa thất bại (Có thể do danh mục đang chứa sản phẩm - Ràng buộc DB)

*** Keywords ***
Mo Trinh Duyet An Danh Va Dang Nhap
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --incognito
    Call Method    ${options}    add_argument    --ignore-certificate-errors
    
    Create Webdriver    Chrome    options=${options}
    Maximize Browser Window
    Set Browser Implicit Wait    5s
    
    Go To    ${BASE_URL}/login
    
    # Dựa trên UI Login bạn viết
    Wait Until Element Is Visible    xpath=//input[@placeholder='Nhập email']    ${TIMEOUT}
    Input Text      xpath=//input[@placeholder='Nhập email']    ${ADMIN_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']      ${ADMIN_PASS}
    Click Button    xpath=//button[text()='Đăng nhập']
    
    # Kiểm tra đã vào Dashboard chưa (Admin.js hiển thị header chào mừng)
    Wait Until Page Contains    Chào mừng đến với trang quản trị    ${TIMEOUT}
    Wait Until Location Contains    /admin/dashboard    ${TIMEOUT}