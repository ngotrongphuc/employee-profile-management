"use client";
import {
  Button,
  Col,
  Flex,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { deleteEmployee, getEmployees } from "../axios";
import EmployeeItem from "../components/EmployeeItem";
import { Employees } from "../types";

const ListEmployees = () => {
  const [listEmployees, setListEmployees] = useState<Employees>({
    totalItems: 0,
    totalPages: 0,
    pageItems: [],
  });
  const [search, setSearch] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<any>(null);

  useEffect(() => {
    fethEmployees();
  }, []);

  // infinite scroll
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPage) => prevPage + 1);
        fethEmployees(search, pageNumber + 1, pageSize);
      }
    });
    if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, lastItemRef]);

  const fethEmployees = async (
    search: string = "",
    pageNumber: number = 1,
    pageSize: number = 10
  ) => {
    setLoading(true);
    const result = await getEmployees({
      search,
      pageNumber,
      pageSize,
    });
    let newListEmployees = {
      ...result,
      pageItems: [...listEmployees.pageItems, ...result.pageItems],
    };
    setListEmployees(newListEmployees);
    setHasMore(newListEmployees.pageItems.length < newListEmployees.totalItems);
    setLoading(false);
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e?.target?.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setPageNumber(1);
    const result = await getEmployees({
      search,
      pageNumber: 1,
      pageSize: 10,
    });
    setListEmployees(result);
    setHasMore(result.pageItems.length < result.totalItems);
    setLoading(false);
  };

  useEffect(() => {
    console.log("list employees", listEmployees);
  }, [listEmployees]);

  const handleDeleteEmployee = async (id: number) => {
    const result = await deleteEmployee(id);
    console.log(result);
    notification.success({
      message: "Deleted successfully!",
      duration: 2,
      placement: "top",
    });
    setListEmployees(result)
  };

  return (
    <div>
      <Typography.Title level={2}>List Employees</Typography.Title>
      <Flex justify="space-between">
        <Space>
          <p>Search Name:</p>
          <Input
            size="large"
            placeholder="Employee name"
            onChange={onChangeSearch}
            value={search}
          />
          <Button size="large" type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>
        <Space>
          <Link href="/createEmployee">
            <Button size="large" type="primary" className="bg-green-600">
              Add employee
            </Button>
          </Link>
        </Space>
      </Flex>
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
        className="py-6"
      >
        {listEmployees?.pageItems.map((employee, index) => (
          <Col
            key={employee.id}
            span={16}
            xs={14}
            sm={12}
            md={10}
            lg={8}
            xl={6}
            xxl={4}
            ref={
              index === listEmployees?.pageItems.length - 1 ? lastItemRef : null
            }
          >
            <EmployeeItem
              employee={employee}
              onDelete={() => handleDeleteEmployee(employee.id as number)}
            />
          </Col>
        ))}
      </Row>
      {loading && (
        <Flex justify="center">
          <Spin />
        </Flex>
      )}
    </div>
  );
};

export default ListEmployees;
