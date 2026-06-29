*** Settings ***
Library           SeleniumLibrary
Suite Setup       Mo Trinh Duyet An Danh
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://localhost:3000
${BROWSER}        Chrome
${DELAY}          0.3s

# Tài khoản
${USER_EMAIL}     vana@gmail.com
${USER_PASS}      123456
${ADMIN_EMAIL}    admin@gmail.com
${ADMIN_PASS}     123456

*** Keywords ***
Mo Trinh Duyet An Danh
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method    ${options}    add_argument    --incognito
    Open Browser    ${URL}    ${BROWSER}    options=${options}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}

Login System
    [Arguments]    ${email}    ${pass}
    Go To    ${URL}/login
    Wait Until Element Is Visible    xpath=//input[@type='email']    10s
    Input Text      xpath=//input[@type='email']       ${email}
    Input Text      xpath=//input[@type='password']    ${pass}
    Click Button    xpath=//button[contains(text(), 'Đăng nhập')]
    Sleep    1s

Nav To Admin Menu
    [Arguments]    ${menu_name}
    Wait Until Element Is Visible    xpath=//a[contains(., '${menu_name}')]    10s
    Click Element                    xpath=//a[contains(., '${menu_name}')]

*** Test Cases ***

# =========================================================
# CHƯƠNG 3.4.1: XÁC THỰC VÀ ĐĂNG KÝ (PASS)
# =========================================================

TC_ACC_01_Login_User_Success
    Login System    ${USER_EMAIL}    ${USER_PASS}
    Wait Until Page Contains    Danh sách sản phẩm
    [Teardown]    Click Button    xpath=//button[contains(text(), 'Đăng xuất')]

TC_ACC_03_Login_Admin_Success
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Wait Until Page Contains    Chào mừng đến với trang quản trị

TC_REG_01_Register_Success
    Go To    ${URL}/register
    Input Text      xpath=//input[@placeholder='Tên đăng nhập']    muc_robot_01
    Input Text      xpath=//input[@placeholder='Email']           muc_robot@gmail.com
    Input Text      xpath=//input[@placeholder='Mật khẩu']        123456
    Input Text      xpath=//input[@placeholder='Nhập lại mật khẩu']    123456
    Click Button    xpath=//button[contains(text(), 'Đăng ký')]
    # Bấm OK nếu có Alert hiện lên
    Run Keyword And Ignore Error    Handle Alert    timeout=5s
    Wait Until Location Is    ${URL}/login    10s

# =========================================================
# CHƯƠNG 3.4.2: QUẢN TRỊ NGƯỜI DÙNG & DOANH THU (CÓ BUG)
# =========================================================

TC_USER_01_Add_New_User_Success
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Nav To Admin Menu    Quản lý Tài khoản
    Click Button       xpath=//button[contains(text(), '+ Thêm Người dùng Mới')]
    Input Text         name=user_name    Robot Admin Tester
    Input Text         name=email        robot_admin@gmail.com
    Input Text         name=password     123456
    Select From List By Value    name=roleid    1
    Click Button       xpath=//button[contains(text(), 'Lưu')]
    Wait Until Page Contains    thành công    10s

TC_Review_02_Check_Sales_Bug_FAIL
    [Documentation]    Xác thực BUG_01 (Thiếu nút) và BUG_02 (Dashboard hiển thị 0)
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Nav To Admin Menu    Quản lý doanh thu
    
    # 1. Kiểm tra BUG_02: Dashboard hiển thị 0 đơn hàng chờ (Trong khi thực tế DB có 36)
    ${pending_count}=    Get Text    xpath=//div[contains(., 'Chờ xử lý')]/following-sibling::div
    Run Keyword If    '${pending_count}' == '0'    Fail    BUG_02: Dashboard hien thi 0 don hang cho mac du DB co du lieu!
    
    # 2. Kiểm tra BUG_01: Tìm dòng có trạng thái 'pending' và check nút 'Xử lý'
    ${status_exists}=    Run Keyword And Return Status    Page Should Contain    pending
    IF    ${status_exists}
        ${btn_exists}=    Run Keyword And Return Status    Page Should Contain Element    xpath=//tr[td[contains(., 'pending')]]//button[contains(text(), 'Xử lý')]
        Run Keyword If    not ${btn_exists}    Fail    BUG_01: Trang thai pending nhung khong co nut Xu ly do thieu API!
    END

# =========================================================
# CHƯƠNG 3.4.3: QUẢN TRỊ SẢN PHẨM & DANH MỤC (CÓ BUG)
# =========================================================

TC_PRO_01_Add_Product_Success
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Nav To Admin Menu    Quản lý Sản phẩm
    Click Button       xpath=//button[contains(text(), '+ Thêm Sản phẩm Mới')]
    Input Text         name=name    Monitor Samsung Curved Robot
    # Chọn theo Index để tránh lỗi text tiếng Việt "Máy ảnh"
    Select From List By Index    name=category_id    1
    Select From List By Index    name=brand_id       1
    Input Text         name=price    12000
    Input Text         name=stock    15
    Click Button       xpath=//button[contains(text(), 'Lưu')]
    Wait Until Page Contains    thành công    10s

TC_CAT_01_Add_Category_Bug_FAIL
    [Documentation]    Xác thực BUG_03: Thiếu ID (undefined)
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Nav To Admin Menu    Quản lý danh mục
    Input Text         xpath=//input[@placeholder='Tên danh mục']    Phu Kien Robot
    Click Button       xpath=//button[contains(text(), 'Thêm mới')]
    Wait Until Page Contains    thành công    10s
    
    # Đọc ID dòng đầu tiên, nếu undefined báo FAIL
    ${new_id}=    Get Text    xpath=//table/tbody/tr[1]/td[1]
    IF    '${new_id}' == 'undefined' or '${new_id}' == ''
        Fail    BUG_03: Them danh muc bao thanh cong nhung ID bi undefined!
    END

TC_BRA_01_Add_Brand_Bug_FAIL
    [Documentation]    Xác thực BUG_04: Thiếu ID (undefined)
    Login System    ${ADMIN_EMAIL}    ${ADMIN_PASS}
    Nav To Admin Menu    Quản lý danh mục
    Click Element      xpath=//button[contains(text(), 'Thương hiệu')]
    Input Text         xpath=//input[@placeholder='Tên thương hiệu']    ASUS
    Click Button       xpath=//button[contains(text(), 'Thêm mới')]
    Wait Until Page Contains    thành công    10s
    
    ${brand_id}=    Get Text    xpath=//table/tbody/tr[1]/td[1]
    IF    '${brand_id}' == 'undefined' or '${brand_id}' == ''
        Fail    BUG_04: Them thuong hieu bao thanh cong nhung ID bi undefined!
    END

# =========================================================
# CHƯƠNG 3.4.5: GIỎ HÀNG VÀ THANH TOÁN (PASS - THÀNH CÔNG)
# =========================================================

TC_Checkout_Flow_Success
    [Documentation]    Đăng nhập lại User -> Thêm giỏ -> Thanh toán (Xác thực 2 Toast)
    Login System    ${USER_EMAIL}    ${USER_PASS}
    Go To           ${URL}/
    
    # Thêm sản phẩm
    Wait Until Element Is Visible    xpath=//input[@placeholder='Tìm theo tên, CPU, RAM...']    10s
    Input Text      xpath=//input[@placeholder='Tìm theo tên, CPU, RAM...']    samsung
    Sleep           1s
    Click Button    xpath=(//button[contains(text(), 'Thêm vào giỏ')])[1]
    Wait Until Page Contains    thành công    10s
    
    # Thanh toán
    Go To           ${URL}/checkout
    Wait Until Page Contains    Thanh toán đơn hàng    10s
    # Chọn phương thức COD và đặt hàng
    Click Element   xpath=//input[@value='COD']
    Click Button    xpath=//button[contains(text(), 'Đặt hàng')]
    
    # Xác thực thông báo (Chỉ tìm chữ "thành công" để tránh lỗi Emoji 🎉)
    Wait Until Page Contains    thành công    15s
    Wait Until Page Contains    Xóa toàn bộ giỏ hàng thành công    15s
    
    # Chờ chuyển hướng (setTimeout 3s)
    Sleep    4s
    Location Should Be    ${URL}/
    
    # Kiểm tra giỏ hàng trống (Hình 2)
    Click Element   xpath=//a[contains(., '🛒 Giỏ hàng')]
    Wait Until Page Contains    Giỏ hàng của bạn đang trống    10s