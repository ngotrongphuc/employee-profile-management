import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Carousel, Image } from "antd";
import Text from "antd/lib/typography/Text";
import Meta from "antd/lib/card/Meta";
import { Employee } from "../types";
import { useEffect, useState } from "react";

const EmployeeItem = ({ employee }: { employee: Employee }) => {
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);

  const arrImages = employee.positions.flatMap((position) =>
    position.toolLanguages.flatMap((toolLanguage) =>
      toolLanguage.images.map((image) => image.cdnUrl)
    )
  );

  const totalYears = employee.positions.reduce((total, position) => {
    const toolsTotal = position.toolLanguages.reduce((sum, toolLanguage) => {
      return sum + (toolLanguage.to - toolLanguage.from) + 1; //add 1 because it should also count the from year
    }, 0);
    return total + toolsTotal;
  }, 0);

  const showDeleteButton = () => {
    setDeleteBtnVisible(true);
  };

  const hideDeleteButton = () => {
    setDeleteBtnVisible(false);
  };

  return (
    <div>
      <Card
        className="shadow-sm"
        style={{ width: 300 }}
        cover={
          <Carousel draggable>
            {arrImages.map((url, index) => (
              <div key={index} className="flex justify-center items-center">
                <Image
                  src={url}
                  preview={false}
                  height={200}
                  className="object-contain"
                />
              </div>
            ))}
          </Carousel>
        }
        onMouseEnter={showDeleteButton}
        onMouseLeave={hideDeleteButton}
        actions={[
          <Button
            size="large"
            type="primary"
            className={`bg-red-600 ${
              deleteBtnVisible ? "visible" : "invisible"
            }`}
          >
            Delete
          </Button>,
        ]}
      >
        <Meta
          title={
            <div>
              <div className="flex justify-between">
                <p className="w-fit">{employee.name}</p>
                <p>{totalYears}</p>
              </div>
              <p className="font-normal">Frontend</p>
            </div>
          }
          description="This is the descriptionnnnnnnnnnnnnnn"
        />
      </Card>
    </div>
  );
};

export default EmployeeItem;
