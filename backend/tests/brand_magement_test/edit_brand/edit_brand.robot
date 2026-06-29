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

TC_01: Sua Thuong Hieu Thanh Cong
    [Documentation]    Test case sửa tên thương hiệu thành công
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Click nút 'Sửa' ở dòng đầu tiên của bảng Thương hiệu
    Wait Until Element Is Visible    xpath=(//button[contains(text(), 'Sửa')])[1]    5s
    Click Button    xpath=(//button[contains(text(), 'Sửa')])[1]
    
    # Kiểm tra form chuyển sang trạng thái Sửa
    Wait Until Page Contains    Sửa thương hiệu    5s
    
    # Nhập tên mới với chuỗi ngẫu nhiên
    ${RANDOM_STRING}=    Generate Random String    4    [LOWER]
    Clear Element Text    xpath=//input[@placeholder='Tên thương hiệu']
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    Brand_Edit_${RANDOM_STRING}
    Capture Page Screenshot    tc01_step1_nhap_ten_moi.png
    
    # Bấm cập nhật
    Click Button    xpath=//button[text()='Cập nhật']
    
    # Kiểm tra thông báo thành công
    Wait Until Page Contains    Cập nhật thương hiệu thành công!    10s
    Capture Page Screenshot    tc01_step2_sua_thanh_cong.png

TC_02: Sua Thuong Hieu That Bai Do Bo Trong Ten
    [Documentation]    Test case sửa thương hiệu thất bại do để trống tên
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Element Is Visible    xpath=(//button[contains(text(), 'Sửa')])[1]    5s
    Click Button    xpath=(//button[contains(text(), 'Sửa')])[1]
    
    Wait Until Page Contains    Sửa thương hiệu    5s
    
    # Xóa trắng tên thương hiệu
    Clear Element Text    xpath=//input[@placeholder='Tên thương hiệu']
    Capture Page Screenshot    tc02_step1_bo_trong_ten.png
    
    # Bấm cập nhật
    Click Button    xpath=//button[text()='Cập nhật']
    
    # Kiểm tra thông báo lỗi
    Wait Until Page Contains    Tên thương hiệu không được để trống    10s
    Capture Page Screenshot    tc02_step2_loi_bo_trong_ten.png

TC_03: Sua Thuong Hieu That Bai Do Ten Da Ton Tai
    [Documentation]    Test case sửa thương hiệu thất bại do tên đã tồn tại (Giả định 'Apple' đã có)
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Element Is Visible    xpath=(//button[contains(text(), 'Sửa')])[1]    5s
    Click Button    xpath=(//button[contains(text(), 'Sửa')])[1]
    
    Wait Until Page Contains    Sửa thương hiệu    5s
    
    # Nhập tên đã tồn tại
    Clear Element Text    xpath=//input[@placeholder='Tên thương hiệu']
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    Apple
    Capture Page Screenshot    tc03_step1_nhap_ten_trung.png
    
    # Bấm cập nhật
    Click Button    xpath=//button[text()='Cập nhật']
    
    # Đợi hiển thị lỗi từ server
    Sleep    2s
    Capture Page Screenshot    tc03_step2_loi_ten_da_ton_tai.png

TC_04: Huy Thao Tac Sua Thuong Hieu
    [Documentation]    Test case bấm nút Sửa sau đó bấm Hủy để form quay về trạng thái Thêm mới
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Element Is Visible    xpath=(//button[contains(text(), 'Sửa')])[1]    5s
    Click Button    xpath=(//button[contains(text(), 'Sửa')])[1]
    
    Wait Until Page Contains    Sửa thương hiệu    5s
    Capture Page Screenshot    tc04_step1_trang_thai_sua.png
    
    # Bấm nút Hủy
    Click Button    xpath=//button[text()='Hủy']
    
    # Kiểm tra form quay về trạng thái Thêm mới
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    Capture Page Screenshot    tc04_step2_trang_thai_them_moi.png

*** Keywords ***
Mo Trinh Duyet
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    # Chạy ẩn danh để không bị hiện Popup mật khẩu
    Call Method    ${options}    add_argument    --incognito
    Call Method    ${options}    add_argument    --disable-save-password-bubble
    Call Method    ${options}    add_argument    --disable-infobars
    Call Method    ${options}    add_argument    --password-store\=basic
    
    Create Webdriver    Chrome    options=${options}
    Set Window Size    1920    1080
    Set Browser Implicit Wait    10s
    
    # Đăng nhập admin
    Go To    ${BASE_URL}/login
    Wait Until Page Contains    ĐĂNG NHẬP    10s
    Input Text      xpath=//input[@placeholder='Nhập email']    ${ADMIN_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']      ${ADMIN_PASS}
    Click Button    xpath=//button[text()='Đăng nhập']
    Sleep    3s
