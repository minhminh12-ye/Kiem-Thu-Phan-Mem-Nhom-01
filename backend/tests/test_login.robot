*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${BROWSER}        chrome
${LOGIN_URL}      http://localhost:3000/login
${USER_EMAIL}     vana@gmail.com
${USER_PASS}      123456

*** Test Cases ***
Dang Nhap Thanh Cong Voi Tai Khoan Customer
    Open Browser                ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    
    # Đợi ô nhập liệu xuất hiện (Tìm theo placeholder vì code React không có name/id)
    Wait Until Element Is Visible    xpath=//input[@placeholder='Nhập email']    15s
    
    # Nhập Email
    Input Text                  xpath=//input[@placeholder='Nhập email']    ${USER_EMAIL}
    
    # Nhập Mật khẩu (Tìm theo type="password")
    Input Password              xpath=//input[@type='password']             ${USER_PASS}
    
    # Click nút Đăng nhập
    Click Button                xpath=//button[text()='Đăng nhập']
    
    # KIỂM TRA CHUYỂN TRANG: 
    # Tài khoản vana là Customer (roleId=2) -> Code React của bạn sẽ navigate("/") 
    # Chúng ta sẽ kiểm tra xem có thấy chữ "Danh sách sản phẩm" ở trang chủ không.
    Wait Until Page Contains    Danh sách sản phẩm    15s
    
    Capture Page Screenshot     ket_qua_dang_nhap_ok.png
    [Teardown]    Close Browser