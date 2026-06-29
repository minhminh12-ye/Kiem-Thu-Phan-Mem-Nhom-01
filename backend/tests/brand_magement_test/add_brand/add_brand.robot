*** Settings ***
Library           SeleniumLibrary
Library           String
Suite Setup       Mo Trinh Duyet
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}           chrome
${BASE_URL}          http://localhost:3000
${ADMIN_EMAIL}       admin@gmail.com
${ADMIN_PASS}        123456

*** Test Cases ***

TC_01: Them Thuong Hieu Thanh Cong
    [Documentation]    Test case thêm mới thương hiệu thành công với dữ liệu hợp lệ
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Nhập dữ liệu với tên random để đảm bảo không bị trùng
    ${RANDOM_STRING}=    Generate Random String    5    [LOWER]
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    Brand_Valid_${RANDOM_STRING}
    Capture Page Screenshot    tc01_step1_nhap_ten_brand.png
    Click Button    xpath=//button[text()='Thêm mới']
    
    # Kiểm tra thông báo thành công
    Wait Until Page Contains    Thêm thương hiệu thành công!    10s
    Capture Page Screenshot    tc01_step2_them_brand_thanh_cong.png

TC_02: Them Thuong Hieu That Bai Do Bo Trong Ten
    [Documentation]    Test case thêm mới thương hiệu thất bại do không nhập tên thương hiệu
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Để trống tên và submit
    Clear Element Text    xpath=//input[@placeholder='Tên thương hiệu']
    Capture Page Screenshot    tc02_step1_bo_trong_ten_brand.png
    Click Button    xpath=//button[text()='Thêm mới']
    
    # Kiểm tra thông báo lỗi hiển thị
    Wait Until Page Contains    Tên thương hiệu không được để trống    10s
    Capture Page Screenshot    tc02_step2_loi_bo_trong_ten.png

TC_03: Them Thuong Hieu That Bai Do Ten Da Ton Tai
    [Documentation]    Test case thêm mới thương hiệu thất bại do tên thương hiệu đã tồn tại (Giả định 'Apple' đã tồn tại)
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Nhập tên đã tồn tại
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    Apple
    Capture Page Screenshot    tc03_step1_nhap_ten_trung.png
    Click Button    xpath=//button[text()='Thêm mới']
    
    # Đợi thông báo lỗi (Thường server sẽ trả về lỗi)
    Sleep    2s
    Capture Page Screenshot    tc03_step2_loi_ten_da_ton_tai.png

TC_04: Them Thuong Hieu Voi Ten Qua Ngan Hoac Chua Ky Tu Dac Biet
    [Documentation]    Test case thêm mới thương hiệu với tên không hợp lệ (ví dụ: chỉ chứa ký tự đặc biệt)
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Nhập ký tự đặc biệt
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    @#$%^&*()
    Capture Page Screenshot    tc04_step1_nhap_ky_tu_dac_biet.png
    Click Button    xpath=//button[text()='Thêm mới']
    
    # Chờ kiểm tra kết quả
    Sleep    2s
    Capture Page Screenshot    tc04_step2_ket_qua_ky_tu_dac_biet.png

*** Keywords ***
Mo Trinh Duyet
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    # Chạy ẩn danh để không bị hiện Popup mật khẩu của Google
    Call Method    ${options}    add_argument    --incognito
    Call Method    ${options}    add_argument    --disable-save-password-bubble
    Call Method    ${options}    add_argument    --disable-infobars
    Call Method    ${options}    add_argument    --password-store\=basic
    
    Create Webdriver    Chrome    options=${options}
    Set Window Size    1920    1080
    Set Browser Implicit Wait    10s
    
    # Đăng nhập vào hệ thống với tài khoản Admin
    Go To    ${BASE_URL}/login
    Wait Until Page Contains    ĐĂNG NHẬP    10s
    Input Text      xpath=//input[@placeholder='Nhập email']    ${ADMIN_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']      ${ADMIN_PASS}
    Click Button    xpath=//button[text()='Đăng nhập']
    Sleep    3s
