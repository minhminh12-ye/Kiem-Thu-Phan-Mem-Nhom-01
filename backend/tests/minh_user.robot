*** Settings ***
Library           SeleniumLibrary
Suite Setup       Mo Trinh Duyet
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}           chrome
${BASE_URL}          http://localhost:3000
${USER_EMAIL}        vana@gmail.com
${USER_PASS}         123456

*** Test Cases ***

TC_01: Dang Nhap Khach Hang
    [Documentation]    Đăng nhập và kiểm tra chuyển hướng về trang chủ
    Go To    ${BASE_URL}/login
    Wait Until Page Contains    ĐĂNG NHẬP    10s
    Input Text      xpath=//input[@placeholder='Nhập email']    ${USER_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']      ${USER_PASS}
    Capture Page Screenshot    step_1_login.png
    Click Button    xpath=//button[text()='Đăng nhập']
    Wait Until Location Is    ${BASE_URL}/    15s

TC_02: Tim Kiem Va Xem Chi Tiet
    [Documentation]    Tìm sản phẩm Samsung và mở/đóng Modal chi tiết
    Wait Until Element Is Visible    xpath=//input[@placeholder='Tìm theo tên, CPU, RAM...']    10s
    Input Text      xpath=//input[@placeholder='Tìm theo tên, CPU, RAM...']    samsung
    Sleep    2s
    Wait Until Element Is Visible    xpath=(//button[text()='Xem chi tiết'])[1]    10s
    Click Button    xpath=(//button[text()='Xem chi tiết'])[1]
    
    Wait Until Element Is Visible    css:.upp-modal__close    10s
    Capture Page Screenshot    step_2_modal.png
    Click Button    css:.upp-modal__close
    Wait Until Element Is Not Visible    css:.upp-modal    5s

TC_03: Them San Pham Vao Gio
    [Documentation]    Nhấn thêm vào giỏ (số lượng mặc định là 1)
    Wait Until Element Is Visible    xpath=(//button[text()='Thêm vào giỏ'])[1]    10s
    Click Button    xpath=(//button[text()='Thêm vào giỏ'])[1]
    
    Wait Until Page Contains    Thêm vào giỏ hàng thành công    15s
    Capture Page Screenshot    step_3_cart_added.png

TC_04: Dieu Chinh Gio Hang - Tang So Luong Len 2
    [Documentation]    Vào giỏ hàng, nhấn nút + để tăng lên 2 và đi tới thanh toán
    Click Element    xpath=//a[contains(., 'Giỏ hàng')]
    Wait Until Location Contains    /cart    10s
    
    # --- BƯỚC TĂNG SỐ LƯỢNG LÊN 2 ---
    Wait Until Element Is Visible    xpath=(//button[text()='+'])[1]    10s
    # Nhấn dấu + một lần (1 + 1 = 2)
    Click Button    xpath=(//button[text()='+'])[1]
    Sleep    1s    # Đợi React cập nhật tổng tiền và UI
    Capture Page Screenshot    step_4_tang_so_luong_2.png
    
    Wait Until Element Is Visible    xpath=//button[contains(text(), 'Tiến hành thanh toán')]    10s
    Click Button    xpath=//button[contains(text(), 'Tiến hành thanh toán')]
    Wait Until Location Contains    /checkout    10s

TC_05: Thanh Toan Don Hang
    [Documentation]    Đặt hàng và xác nhận qua màn hình giỏ hàng trống
    Wait Until Page Contains    Thanh toán đơn hàng    10s
    Capture Page Screenshot    step_5_checkout.png
    Click Element    xpath=//input[@value='COD']
    Click Button    xpath=//button[contains(text(), 'Đặt hàng')]
    
    Wait Until Page Contains    Giỏ hàng của bạn đang trống    15s
    Capture Page Screenshot    step_6_final_success.png
    Sleep    4s
    Location Should Be    ${BASE_URL}/

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