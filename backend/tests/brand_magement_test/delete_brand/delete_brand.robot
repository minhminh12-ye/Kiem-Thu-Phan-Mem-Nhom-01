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

TC_01: Xoa Thuong Hieu Dang Co San Pham
    [Documentation]    Test case xóa thương hiệu đang có sản phẩm, pass nếu hệ thống báo lỗi không cho phép xóa
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Bấm Xóa ở dòng đầu tiên có sản phẩm (số lượng khác 0)
    Wait Until Element Is Visible    xpath=(//tr[td//span[not(text()='0')]]//button[contains(text(), 'Xóa')])[1]    5s
    Click Button    xpath=(//tr[td//span[not(text()='0')]]//button[contains(text(), 'Xóa')])[1]
    
    # Đồng ý Xóa trên Alert
    ${alert_text}=    Handle Alert    ACCEPT
    Log    Nội dung Alert: ${alert_text}
    
    # Chờ hệ thống xử lý API (thường sẽ hiện toast báo lỗi)
    Sleep    2s
    
    # Xác minh không xuất hiện thông báo thành công (tức là đã bị chặn/báo lỗi)
    Page Should Not Contain    Xóa thương hiệu thành công!
    Capture Page Screenshot    tc01_loi_xoa_brand_co_san_pham.png

TC_02: Huy Thao Tac Xoa Thuong Hieu
    [Documentation]    Test case bấm Xóa nhưng chọn Cancel (Hủy) để không xóa dữ liệu
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Bấm Xóa ở dòng đầu tiên
    Wait Until Element Is Visible    xpath=(//button[contains(text(), 'Xóa')])[1]    5s
    Click Button    xpath=(//button[contains(text(), 'Xóa')])[1]
    
    # Dismiss (Hủy) Alert
    Handle Alert    DISMISS
    
    # Chờ 2s để đảm bảo không có thông báo Xóa thành công xuất hiện
    Sleep    2s
    Capture Page Screenshot    tc02_huy_xoa.png

TC_03: Xoa Thuong Hieu Thanh Cong
    [Documentation]    Test case xóa thương hiệu thành công (Chọn OK trên Alert)
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # Bấm Xóa ở dòng đầu tiên có 0 sản phẩm để chắc chắn không bị lỗi ràng buộc dữ liệu
    Wait Until Element Is Visible    xpath=(//tr[td//span[text()='0']]//button[contains(text(), 'Xóa')])[1]    5s
    Click Button    xpath=(//tr[td//span[text()='0']]//button[contains(text(), 'Xóa')])[1]
    
    # Accept (Đồng ý) Alert
    Handle Alert    ACCEPT
    
    # Kiểm tra thông báo xóa thành công
    Wait Until Page Contains    Xóa thương hiệu thành công!    10s
    Capture Page Screenshot    tc03_xoa_thanh_cong.png

TC_04: Tao Moi Va Xoa Thuong Hieu Do (End-to-End)
    [Documentation]    Test case tạo 1 thương hiệu mới sau đó tiến hành xóa ngay thương hiệu vừa tạo
    Go To    ${BASE_URL}/admin/category
    Wait Until Page Contains    📁 Quản lý Danh mục & Thương hiệu    10s
    
    # Chuyển sang tab Thương hiệu
    Click Button    xpath=//button[contains(text(), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    5s
    
    # 1. Thêm mới thương hiệu để test xóa an toàn
    ${RANDOM_STRING}=    Generate Random String    4    [LOWER]
    ${brand_name}=       Set Variable    Brand_To_Delete_${RANDOM_STRING}
    Input Text      xpath=//input[@placeholder='Tên thương hiệu']    ${brand_name}
    Click Button    xpath=//button[text()='Thêm mới']
    Wait Until Page Contains    Thêm thương hiệu thành công!    10s
    
    # 2. Xóa thương hiệu vừa tạo
    # Đợi bảng reload và tìm nút Xóa tương ứng với brand_name
    Sleep    2s
    Wait Until Element Is Visible    xpath=//tr[td[contains(., '${brand_name}')]]//button[contains(text(), 'Xóa')]    5s
    Click Button    xpath=//tr[td[contains(., '${brand_name}')]]//button[contains(text(), 'Xóa')]
    
    # Đồng ý Xóa
    Handle Alert    ACCEPT
    
    # Kiểm tra thành công
    Wait Until Page Contains    Xóa thương hiệu thành công!    10s
    Capture Page Screenshot    tc04_xoa_brand_moi_tao.png

*** Keywords ***
Mo Trinh Duyet
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
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
