import LayoutAdmin from '~/components/layout/Admin/Layout'
import { Card, Col, Form, Input, Row, Select, Tabs, theme, Typography } from 'antd'
import { dataSettingApi } from '~/apis/settingApi'
import { toastError, toastSuccess } from '~/components/toast'
import { CopyBlock, dracula } from 'react-code-blocks';
import { FaLink } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';
import { decrypt, encrypt } from '~/utils/crypto';

const Setting = () => {
    const { token: { colorBgContainer, colorPrimary } } = theme.useToken();
    const [formApiLogin] = Form.useForm();
    const [formApiSend] = Form.useForm();

    const handlePutApiLogin = (data) => {
        const formatData = encrypt(data.title)
        console.log(formatData);
        const data1 = decrypt(formatData)
        console.log(data1);
    }

    const handlePutApiSend = (data) => {
        console.log(data);
    }

    return (
        <LayoutAdmin header={'CÀI ĐẶT'}>
            <Tabs
                type="card"
                defaultActiveKey='1'
                items={[
                    {
                        key: '1',
                        label: 'Cài đặt chung',
                        children: <>
                            <Row gutter={[24, 24]}>
                                <Col xxl={{ span: 8 }} xl={{ span: 12 }} md={{ span: 12 }} span={24}>
                                    <Card className='h-full' title="Khôi phục - Sao lưu">
                                        <div className="flex justify-between items-center">
                                            <Typography> Tự động sao lưu dữ liệu theo: </Typography>
                                            <Select
                                                onChange={(value, option) => {
                                                    dataSettingApi.put({
                                                        "restore-backup": {
                                                            time: value
                                                        }
                                                    })
                                                        .then(() => {
                                                            toastSuccess(value, 'Đã thay đổi cài đặt sao lưu dữ liệu!', `Sao lưu dữ liệu theo ${option.label}`)
                                                        })
                                                        .catch(err => {
                                                            toastError(value, 'Không thể thay đổi cài đặt sao lưu dữ liệu!', err.message)
                                                        })
                                                }}

                                                options={[
                                                    { label: 'Ngày', value: '0 0 * * *' },
                                                    { label: 'Tuần', value: '0 0 * * 1' },
                                                    { label: 'Tháng', value: '0 0 1 * *' },
                                                ]}
                                                className='!ml-2'
                                                style={{ width: '90px' }}
                                                defaultValue={'0 0 * * *'}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </>,
                    },
                    {
                        key: '2',
                        label: 'Code mẫu',
                        children: <>
                            <Row gutter={[24, 24]}>
                                <Col xl={{ span: 12 }} span={24}>
                                    <Card className='h-full' title=<>
                                        <div className="flex justify-between items-center">
                                            <Typography>Google Sheets</Typography>
                                            <Typography.Link target='_blank' href='https://docs.google.com/spreadsheets'>
                                                <FaLink className='cursor-pointer' size={20} />
                                            </Typography.Link>
                                        </div>
                                    </>>
                                        <CopyBlock
                                            text={
                                                `const DATA_ENTRY_SHEET_NAME = "Thay thế bằng tên SHEET của bạn";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_ENTRY_SHEET_NAME);

const doPost = (request = {}) => {
  const { postData: { contents, type } = {} } = request;
  var data = parseFormData(contents);
  appendToGoogleSheet(data);
  return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
};

function parseFormData(postData) {
  var data = [];
  var parameters = postData.split('&');
  for (var i = 0; i < parameters.length; i++) {
    var keyValue = parameters[i].split('=');
    data[keyValue[0]] = decodeURIComponent(keyValue[1]);
  }
  return data;
}

function appendToGoogleSheet(data) {
  if (TIME_STAMP_COLUMN_NAME !== "") {
    data[TIME_STAMP_COLUMN_NAME] = new Date();
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = headers.map(headerFld => data[headerFld]);
  sheet.appendRow(rowData);
}

                                                `}
                                            language={'js'}
                                            showLineNumbers={true}
                                            theme={dracula}
                                            codeBlock
                                        />
                                    </Card>
                                </Col>

                                <Col xl={{ span: 12 }} span={24}>
                                    <Card title=<div className='flex justify-between items-center'>
                                        <p>Giảm kích thước video</p>
                                        <div className="flex gap-2">
                                            <Typography.Link className='flex items-center gap-1' target='_blank' href='https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z'>
                                                <FaLink className='cursor-pointer' size={20} /> Cài đặt
                                            </Typography.Link>
                                            <Typography.Link className='flex items-center gap-1' target='_blank' href='https://youtu.be/vsIIJ83sjpc?si=XhL8qjKupZ3U0C-J'>
                                                <FaLink className='cursor-pointer' size={20} /> Hướng dẫn
                                            </Typography.Link>
                                        </div>
                                    </div>
                                    >
                                        <Row gutter={[24, 24]}>
                                            <Col span={24}>
                                                <Card title='Chất lượng cao nhất (3.6 Gb to 556 Mb)'>
                                                    <CopyBlock
                                                        text={`$compressedFolder = "compressed"
if (-not (Test-Path -Path $compressedFolder)) {
    New-Item -ItemType Directory -Path $compressedFolder
}
$videoFiles = Get-ChildItem -Path . -Filter *.mp4
foreach ($file in $videoFiles) {
    $inputFile = $file.FullName
    $outputFile = Join-Path -Path $compressedFolder -ChildPath $file.Name
    ffmpeg -i $inputFile -vcodec h264 -acodec aac $outputFile
    Write-Host "Đã xử lý và lưu file: $($file.Name) vào thư mục $compressedFolder"
}
Write-Host "Hoàn thành việc nén tất cả video vào thư mục $compressedFolder."
                                                        `}
                                                        language={'js'}
                                                        showLineNumbers={true}
                                                        theme={dracula}
                                                        codeBlock
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </>,
                    },
                    {
                        key: '3',
                        label: 'Api Key',
                        children: <>
                            <Row gutter={[24, 24]}>
                                <Col xxl={{ span: 6 }} xl={{ span: 8 }} md={{ span: 12 }} span={24}>
                                    <Card
                                        title=<div className='flex justify-between items-center'>
                                            <Typography> Api Key Đăng Nhập Google</Typography>
                                            <FaSave className='cursor-pointer' onClick={() => formApiLogin.submit()} size={20} color={colorPrimary} />
                                        </div>
                                    >
                                        <Form
                                            form={formApiLogin}
                                            name="API_LOGIN"
                                            layout="vertical"
                                            onFinish={handlePutApiLogin}
                                        >
                                            <Form.Item
                                                className='mb-2'
                                                name="title"
                                                label="Api Key"
                                                rules={[{ required: true, message: 'Nhập api key!' }]}
                                            >
                                                <Input.Password placeholder="Nhập api key" size='large' />
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>

                                <Col xxl={{ span: 6 }} xl={{ span: 8 }} md={{ span: 12 }} className='mb-6' span={24}>
                                    <Card
                                        title=<div className='flex justify-between items-center'>
                                            <Typography>Api Key Gửi Email Google</Typography>
                                            <FaSave className='cursor-pointer' onClick={() => formApiSend.submit()} size={20} color={colorPrimary} />
                                        </div>
                                    >
                                        <Form
                                            form={formApiSend}
                                            name="API_SEND"
                                            layout="vertical"
                                            onFinish={handlePutApiSend}
                                        >
                                            <Form.Item
                                                className='mb-2'
                                                name="title"
                                                label="Api Key"
                                                rules={[{ required: true, message: 'Nhập api key!' }]}
                                            >
                                                <Input.Password placeholder="Nhập api key" size='large' />
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </>,
                    },
                ]}
            />
        </LayoutAdmin>
    )
}

export default Setting