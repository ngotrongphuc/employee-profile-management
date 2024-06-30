"use client";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  notification,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { createEmployee, getPositionResources } from "../axios";
import { Employee, PositionResources } from "../types";
import { find, isEmpty, map, mapValues } from "lodash";
import {
  LoadingOutlined,
  PlusOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CreateEmployee = () => {
  const [positionResources, setPositionResources] = useState<PositionResources>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const formWatch = Form.useWatch((values) => values, form);
  const router = useRouter();

  useEffect(() => {
    console.log(formWatch);
  }, [formWatch]);

  const positionOptions = useMemo(
    () =>
      positionResources.map((position) => ({
        label: position.name,
        value: position.positionResourceId,
      })),
    [positionResources]
  );

  useEffect(() => {
    fetchPositionResources();
  }, []);

  const fetchPositionResources = async () => {
    setLoading(true);
    const result = await getPositionResources();
    setPositionResources(result);
    setLoading(false);
  };

  const handleSave = async () => {
    const formData = form.getFieldsValue();
    console.log("formData", formData);
    const positionsData = formData.positions.map(
      (positionData: any, positionDataIndex: number) => {
        const toolLanguagesData = positionData.toolLanguages.map(
          (toolLanguageData: any, toolLanguageDataIndex: number) => {
            const imagesData = toolLanguageData.images?.fileList.map(
              (file: any, imageIndex: number) => ({
                data: file,
                displayOrder: imageIndex,
              })
            );
            return {
              toolLanguageResourceId: toolLanguageData.toolLanguage.key,
              displayOrder: toolLanguageDataIndex,
              from: toolLanguageData.fromTo[0].year(),
              to: toolLanguageData.fromTo[1].year(),
              description: toolLanguageData.description,
              images: imagesData,
            };
          }
        );
        return {
          positionResourceId: positionData.position.key,
          displayOrder: positionDataIndex,
          toolLanguages: toolLanguagesData,
        };
      }
    );
    const employeeData = {
      name: formData.name,
      positions: positionsData,
    };
    const result = await createEmployee(employeeData);
    console.log(result);
    notification.success({
      message: "Created successfully!",
      duration: 2,
      placement: "top",
    });
    router.push("/listEmployees");
  };

  return (
    <div>
      <Link href="/listEmployees">
        <RollbackOutlined className="text-2xl" />
      </Link>
      <Typography.Title level={2}>List Employees</Typography.Title>
      <Form
        form={form}
        initialValues={{}}
        autoComplete="off"
        size="large"
        className="max-w-screen-2xl"
        onFinish={handleSave}
      >
        <Form.Item
          label="Name"
          name="name"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          labelAlign="left"
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col span={16}>
              <Form.Item
                name="name"
                noStyle
                rules={[{ required: true, message: "Please input name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.List name="positions">
          {(fields, opt) => (
            <div>
              {fields.map((field, fieldIndex) => (
                <div>
                  <Form.Item
                    label="Postion"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    labelAlign="left"
                  >
                    <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                      <Col span={16}>
                        <Form.Item
                          name={[field.name, "position"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Please choose one position!",
                            },
                          ]}
                        >
                          <Select options={positionOptions} labelInValue />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Button
                          type="primary"
                          className="bg-gray-500"
                          onClick={() => opt.remove(field.name)}
                        >
                          Delete Position
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item
                    label="Tool/Language"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    labelAlign="left"
                  >
                    <Form.List name={[field.name, "toolLanguages"]}>
                      {(subFields, subOpt) => (
                        <div>
                          {subFields.map((subField, subFieldIndex) => (
                            <>
                              <Row
                                key={subField.key}
                                gutter={{ xs: 8, sm: 16, md: 24 }}
                              >
                                <Col span={8}>
                                  <Form.Item noStyle shouldUpdate>
                                    {() => {
                                      const toolLanguageOptions = find(
                                        positionResources,
                                        {
                                          positionResourceId:
                                            form.getFieldValue("positions")[
                                              fieldIndex
                                            ]?.position?.value,
                                        }
                                      )?.toolLanguageResources.map(
                                        (toolLanguage) => ({
                                          label: toolLanguage.name,
                                          value:
                                            toolLanguage.toolLanguageResourceId,
                                        })
                                      );

                                      return (
                                        <Form.Item
                                          name={[subField.name, "toolLanguage"]}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please choose one tool/language!",
                                            },
                                          ]}
                                        >
                                          <Select
                                            placeholder="Select Tool/Language"
                                            options={toolLanguageOptions}
                                            labelInValue
                                          />
                                        </Form.Item>
                                      );
                                    }}
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    name={[subField.name, "fromTo"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select years!",
                                      },
                                    ]}
                                  >
                                    <DatePicker.RangePicker
                                      picker="year"
                                      placeholder={["From", "To"]}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Button
                                    type="primary"
                                    className="bg-gray-500 max-w-min text-wrap"
                                    onClick={() => {
                                      subOpt.remove(subField.name);
                                    }}
                                  >
                                    Delete Tool/Language
                                  </Button>
                                </Col>
                              </Row>
                              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                                <Col span={16}>
                                  <Form.Item
                                    name={[subField.name, "description"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input description!",
                                      },
                                    ]}
                                  >
                                    <Input.TextArea
                                      rows={4}
                                      placeholder="Description..."
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Form.Item shouldUpdate>
                                {() => {
                                  const imageUrl =
                                    form.getFieldValue("positions")[fieldIndex]
                                      .toolLanguages[subFieldIndex]?.images
                                      ?.fileList || "";

                                  return (
                                    <Form.Item name={[subField.name, "images"]}>
                                      <Upload listType="picture-card">
                                        {imageUrl ? (
                                          <Image
                                            src={imageUrl}
                                            alt="image"
                                            style={{ width: "100%" }}
                                          />
                                        ) : (
                                          <div className="flex flex-col justify-center items-center">
                                            {loading ? (
                                              <LoadingOutlined />
                                            ) : (
                                              <PlusOutlined />
                                            )}
                                            <p className="mt-2">Upload</p>
                                          </div>
                                        )}
                                      </Upload>
                                    </Form.Item>
                                  );
                                }}
                              </Form.Item>
                              <Col span={16}>
                                <Divider
                                  className={`bg-gray-300 ${
                                    subFieldIndex === subFields.length - 1
                                      ? "hidden"
                                      : ""
                                  }`}
                                />
                              </Col>
                            </>
                          ))}
                          <Button
                            type="primary"
                            ghost
                            onClick={() => subOpt.add()}
                          >
                            Add Tool/Language
                          </Button>
                        </div>
                      )}
                    </Form.List>
                    <Col span={16}>
                      <Divider
                        className={`bg-gray-500 ${
                          fieldIndex === fields.length - 1 ? "hidden" : ""
                        }`}
                      />
                    </Col>
                  </Form.Item>
                </div>
              ))}

              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col span={16} offset={3}>
                  <Button type="primary" onClick={() => opt.add()}>
                    Add Position
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Form.List>

        <Form.Item
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          label=" "
          colon={false}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col push={16}>
              <Form.Item noStyle>
                <Button
                  type="primary"
                  className="bg-green-600 w-28"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEmployee;
