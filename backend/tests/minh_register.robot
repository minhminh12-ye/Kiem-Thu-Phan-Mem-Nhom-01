*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${BROWSER}           chrome
${REGISTER_URL}      http://localhost:3000/register
${LOGIN_URL}         http://localhost:3000/login

${NEW_USER}          muc0505
${NEW_EMAIL}         muc0505@gmail.com
${NEW_PASS}          123456
${WRONG_CONFIRM}     654321

*** Test Cases ***
Dang Ky Khong Thanh Cong Do Mat Khau Khong Khop
    [Documentation]    Test trường hợp nhập mật khẩu xác nhận sai
    Open Browser                ${REGISTER_URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Element Is Visible    xpath=//input[@placeholder='Tên đăng nhập']    15s

    Input Text      xpath=//input[@placeholder='Tên đăng nhập']      ${NEW_USER}
    Input Text      xpath=//input[@placeholder='Email']              ${NEW_EMAIL}
    Input Password  xpath=//input[@placeholder='Mật khẩu']           ${NEW_PASS}
    Input Password  xpath=//input[@placeholder='Nhập lại mật khẩu']  ${WRONG_CONFIRM}

    Click Button    xpath=//button[text()='Đăng ký']
    
    # Kiểm tra thông báo lỗi hiện ra trên màn hình
    Wait Until Page Contains    Mật khẩu xác nhận không khớp!    10s
    Capture Page Screenshot     loi_mat_khau_khong_khop.png
    [Teardown]      Close Browser

Dang Ky Thanh Cong Tai Khoan Khach Hang
    [Documentation]    Test luồng đăng ký chuẩn thành công
    Open Browser                ${REGISTER_URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Element Is Visible    xpath=//input[@placeholder='Tên đăng nhập']    5s
    
    Input Text      xpath=//input[@placeholder='Tên đăng nhập']      ${NEW_USER}
    Capture Page Screenshot     qua_trinh_dang_ky1.png

    Input Text      xpath=//input[@placeholder='Email']              ${NEW_EMAIL}
    Capture Page Screenshot     qua_trinh_dang_ky2.png

    Input Password  xpath=//input[@placeholder='Mật khẩu']           ${NEW_PASS}
    Capture Page Screenshot     qua_trinh_dang_ky3.png

    Input Password  xpath=//input[@placeholder='Nhập lại mật khẩu']  ${NEW_PASS}
    Capture Page Screenshot     qua_trinh_dang_ky4.png

    
    Click Button    xpath=//button[text()='Đăng ký']
    Capture Page Screenshot     qua_trinh_dang_kỵ.png

    # Note: If your app uses a browser 'alert' popup, keep this. 
    # If it's a HTML div/toast message, use 'Wait Until Page Contains' instead.
    Alert Should Be Present    Đăng ký thành công!    timeout=20s
    Capture Page Screenshot     dang_ky_thanh_cong 1.png


    Wait Until Location Is     ${LOGIN_URL}    20s
        Capture Page Screenshot     dang_ky_thanh_cong2.png

    Wait Until Page Contains    ĐĂNG NHẬP    20s
    
    Capture Page Screenshot     dang_ky_thanh_cong3.png
    [Teardown]    Close Browser