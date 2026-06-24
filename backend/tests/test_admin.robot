*** Settings ***
Library           SeleniumLibrary
Library           OperatingSystem
Suite Teardown    Close All Browsers

*** Variables ***
${BROWSER}              chrome
${LOGIN_URL}            http://localhost:3000/login
${ADMIN_EMAIL}          admin@gmail.com
${ADMIN_PASS}           123456
${TIMEOUT}              20s

${NEW_PRODUCT_NAME}     Monitor Samsung Curved Robot
${NEW_PRODUCT_CAT}      Máy ảnh
${NEW_PRODUCT_BRAND}    LG
${NEW_PRODUCT_PRICE}    12000000
${NEW_PRODUCT_STOCK}    15
${NEW_PRODUCT_SPEC_K1}  Màu
${NEW_PRODUCT_SPEC_V1}  Đỏ
${NEW_PRODUCT_SPEC_K2}  Độ dài
${NEW_PRODUCT_SPEC_V2}  8 inch
${NEW_PRODUCT_IMAGE}    https://picsum.photos/200/311

${UPDATE_PRODUCT_PRICE}  99999
${NEW_CAT_NAME}         Phụ Kiện Robot
${UPDATE_CAT_NAME}      DM
${NEW_BRA_NAME}         ASUS
${UPDATE_BRA_NAME}      DELL

*** Keywords ***
Capture Screenshot For Test Case
    Create Directory    ${OUTPUT_DIR}/screenshots
    ${timestamp}=    Get Time    epoch
    Capture Page Screenshot    ${OUTPUT_DIR}/screenshots/${TEST_NAME}_${timestamp}.png

Dang Nhap Admin
    Open Browser                ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    xpath=//input[@placeholder='Nhập email']    ${TIMEOUT}
    Input Text                  xpath=//input[@placeholder='Nhập email']    ${ADMIN_EMAIL}
    Input Password              xpath=//input[@type='password']             ${ADMIN_PASS}
    Click Button                xpath=//button[contains(normalize-space(.), 'Đăng nhập')]
    Wait Until Location Contains    /admin    ${TIMEOUT}

Di Den Quan Ly San Pham
    Wait Until Element Is Visible    xpath=//a[contains(., 'Quản lý Sản phẩm')]    ${TIMEOUT}
    Click Element               xpath=//a[contains(., 'Quản lý Sản phẩm')]
    Wait Until Page Contains    Quản lý Sản phẩm    ${TIMEOUT}

Di Den Quan Ly Danh Muc
    Wait Until Element Is Visible    xpath=//a[contains(., 'Quản lý danh mục, thương hiệu')]    ${TIMEOUT}
    Click Element               xpath=//a[contains(., 'Quản lý danh mục, thương hiệu')]
    Wait Until Page Contains    Quản lý Danh mục & Thương hiệu    ${TIMEOUT}

Chuyen Sang Tab Thuong Hieu
    Wait Until Element Is Visible    xpath=//button[contains(normalize-space(.), 'Thương hiệu')]    ${TIMEOUT}
    Click Element               xpath=//button[contains(normalize-space(.), 'Thương hiệu')]
    Wait Until Page Contains    Thêm thương hiệu mới    ${TIMEOUT}

*** Test Cases ***
TC PRO 01 Them San Pham Moi Thanh Cong
    [Documentation]    Thêm sản phẩm mới với đầy đủ thông tin.
    [Tags]    product    create
    Dang Nhap Admin
    Di Den Quan Ly San Pham
    Click Button                xpath=//button[contains(normalize-space(.), '+ Thêm Sản phẩm Mới')]
    Wait Until Page Contains    Thêm Sản phẩm Mới    ${TIMEOUT}
    Input Text                  xpath=//input[@name='name']    ${NEW_PRODUCT_NAME}
    Select From List By Label   xpath=//select[@name='category_id']    ${NEW_PRODUCT_CAT}
    Select From List By Label   xpath=//select[@name='brand_id']    ${NEW_PRODUCT_BRAND}
    Clear Element Text          xpath=//input[@name='price']
    Input Text                  xpath=//input[@name='price']    ${NEW_PRODUCT_PRICE}
    Clear Element Text          xpath=//input[@name='stock']
    Input Text                  xpath=//input[@name='stock']    ${NEW_PRODUCT_STOCK}
    Input Text                  xpath=(//input[@placeholder='Tên thông số (vd: Màu, Kích thước)'])[1]    ${NEW_PRODUCT_SPEC_K1}
    Input Text                  xpath=(//input[@placeholder='Giá trị (vd: Đen, 5 inch)'])[1]    ${NEW_PRODUCT_SPEC_V1}
    Click Button                xpath=//button[contains(normalize-space(.), '+ Thêm thông số')]
    Wait Until Element Is Visible    xpath=(//input[@placeholder='Tên thông số (vd: Màu, Kích thước)'])[2]    ${TIMEOUT}
    Input Text                  xpath=(//input[@placeholder='Tên thông số (vd: Màu, Kích thước)'])[2]    ${NEW_PRODUCT_SPEC_K2}
    Input Text                  xpath=(//input[@placeholder='Giá trị (vd: Đen, 5 inch)'])[2]    ${NEW_PRODUCT_SPEC_V2}
    Input Text                  xpath=//input[@name='image_url']    ${NEW_PRODUCT_IMAGE}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Lưu')]
    Wait Until Page Contains    Thêm sản phẩm mới thành công!    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC PRO 02 Cap Nhat Gia San Pham
    [Documentation]    Sửa giá sản phẩm đầu tiên thành 99999.
    [Tags]    product    update
    Dang Nhap Admin
    Di Den Quan Ly San Pham
    Wait Until Element Is Visible    xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]
    Wait Until Page Contains    Sửa Sản phẩm    ${TIMEOUT}
    Clear Element Text          xpath=//input[@name='price']
    Input Text                  xpath=//input[@name='price']    ${UPDATE_PRODUCT_PRICE}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Lưu')]
    Wait Until Page Contains    Cập nhật sản phẩm thành công!    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC PRO 03 Xoa San Pham
    [Documentation]    Xóa sản phẩm đầu tiên và xác nhận popup trình duyệt.
    [Tags]    product    delete
    Dang Nhap Admin
    Di Den Quan Ly San Pham
    Wait Until Element Is Visible    xpath=(//button[contains(normalize-space(.), 'Xóa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//button[contains(normalize-space(.), 'Xóa')])[1]
    Handle Alert                ACCEPT
    Wait Until Page Contains    Xóa sản phẩm thành công!    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC CAT 01 Them Danh Muc Moi
    [Documentation]    Thêm danh mục mới và kiểm tra hiển thị.
    [Tags]    category    create
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Wait Until Page Contains    Thêm danh mục mới    ${TIMEOUT}
    Input Text                  xpath=//input[@placeholder='Tên danh mục']    ${NEW_CAT_NAME}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Thêm mới')]
    Wait Until Page Contains    Thêm danh mục thành công!    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=//tr[td[strong[text()='${NEW_CAT_NAME}']]]    ${TIMEOUT}
    Page Should Contain Element      xpath=//tr[td[strong[text()='${NEW_CAT_NAME}']] and td[span[text()='0']]]
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC CAT 02 Cap Nhat Danh Muc
    [Documentation]    Sửa danh mục đầu tiên thành DM.
    [Tags]    category    update
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Wait Until Page Contains    Danh sách danh mục    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]
    Wait Until Element Is Visible    xpath=//input[@placeholder='Tên danh mục']    ${TIMEOUT}
    Clear Element Text          xpath=//input[@placeholder='Tên danh mục']
    Input Text                  xpath=//input[@placeholder='Tên danh mục']    ${UPDATE_CAT_NAME}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Cập nhật')]
    Wait Until Page Contains    Cập nhật danh mục thành công!    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=//tr[td[strong[text()='${UPDATE_CAT_NAME}']]]    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC CAT 03 Xoa Danh Muc Co So San Pham Bang 0
    [Documentation]    Xóa danh mục có số sản phẩm bằng 0.
    [Tags]    category    delete    success
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Wait Until Page Contains    Danh sách danh mục    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//tr[td[span[text()='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//tr[td[span[text()='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]
    Handle Alert                ACCEPT
    Wait Until Page Contains    Xóa danh mục thành công!    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC CAT 04 Xoa Danh Muc Co San Pham Bi Khoa
    [Documentation]    Cố xóa danh mục có sản phẩm đang sử dụng.
    [Tags]    category    delete    error
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Wait Until Page Contains    Danh sách danh mục    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//tr[td[span[text()!='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//tr[td[span[text()!='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]
    Handle Alert                ACCEPT
    Wait Until Page Contains    đang sử dụng    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC BRA 01 Them Thuong Hieu Moi
    [Documentation]    Thêm thương hiệu mới và kiểm tra hiển thị.
    [Tags]    brand    create
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Chuyen Sang Tab Thuong Hieu
    Wait Until Page Contains    Thêm thương hiệu mới    ${TIMEOUT}
    Input Text                  xpath=//input[@placeholder='Tên thương hiệu']    ${NEW_BRA_NAME}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Thêm mới')]
    Wait Until Page Contains    Thêm thương hiệu thành công!    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=//tr[td[strong[text()='${NEW_BRA_NAME}']]]    ${TIMEOUT}
    Page Should Contain Element      xpath=//tr[td[strong[text()='${NEW_BRA_NAME}']] and td[span[text()='0']]]
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC BRA 02 Cap Nhat Thuong Hieu
    [Documentation]    Sửa thương hiệu đầu tiên thành DELL.
    [Tags]    brand    update
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Chuyen Sang Tab Thuong Hieu
    Wait Until Page Contains    Danh sách thương hiệu    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//button[contains(normalize-space(.), 'Sửa')])[1]
    Wait Until Element Is Visible    xpath=//input[@placeholder='Tên thương hiệu']    ${TIMEOUT}
    Clear Element Text          xpath=//input[@placeholder='Tên thương hiệu']
    Input Text                  xpath=//input[@placeholder='Tên thương hiệu']    ${UPDATE_BRA_NAME}
    Click Button                xpath=//button[@type='submit' and contains(normalize-space(.), 'Cập nhật')]
    Wait Until Page Contains    Cập nhật thương hiệu thành công!    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=//tr[td[strong[text()='${UPDATE_BRA_NAME}']]]    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC BRA 03 Xoa Thuong Hieu Co So San Pham Bang 0
    [Documentation]    Xóa thương hiệu có số sản phẩm bằng 0.
    [Tags]    brand    delete    success
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Chuyen Sang Tab Thuong Hieu
    Wait Until Page Contains    Danh sách thương hiệu    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//tr[td[span[text()='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//tr[td[span[text()='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]
    Handle Alert                ACCEPT
    Wait Until Page Contains    Xóa thương hiệu thành công!    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser

TC BRA 04 Xoa Thuong Hieu Co San Pham Bi Khoa
    [Documentation]    Cố xóa thương hiệu có sản phẩm đang sử dụng.
    [Tags]    brand    delete    error
    Dang Nhap Admin
    Di Den Quan Ly Danh Muc
    Chuyen Sang Tab Thuong Hieu
    Wait Until Page Contains    Danh sách thương hiệu    ${TIMEOUT}
    Wait Until Element Is Visible    xpath=(//tr[td[span[text()!='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]    ${TIMEOUT}
    Click Button                xpath=(//tr[td[span[text()!='0']]]//button[contains(normalize-space(.), 'Xóa')])[1]
    Handle Alert                ACCEPT
    Wait Until Page Contains    đang sử dụng    ${TIMEOUT}
    [Teardown]    Run Keywords    Capture Screenshot For Test Case    AND    Close Browser
