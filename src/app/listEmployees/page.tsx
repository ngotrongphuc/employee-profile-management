"use client";
import Title from "antd/lib/typography/Title";
import { Button, Col, Flex, Input, Row, Space, Spin } from "antd";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import EmployeeItem from "../components/EmployeeItem";
import { Employee, Employees } from "../types";
import axios from "axios";
import { getEmployees } from "../axios";
import { isEmpty } from "lodash";

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
    console.log("fetch", search, pageNumber, pageSize, result);
    let newListEmployees = {
      ...result,
      pageItems: [...listEmployees.pageItems, ...result.pageItems],
    };
    // if (isEmpty(search)) {
    //   newListEmployees = {
    //     ...result,
    //     pageItems: [...listEmployees.pageItems, ...result.pageItems],
    //   };
    // } else {
    //   newListEmployees = result;
    // }
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
    console.log("search", search, 1, 10, result);
    setListEmployees(result);
    setHasMore(result.pageItems.length < result.totalItems);
    setLoading(false);
  };

  useEffect(() => {
    console.log("list employees", listEmployees);
  }, [listEmployees]);

  return (
    <div>
      <Title level={2}>List Employees</Title>
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
          <Button size="large" type="primary" className="bg-green-600">
            Add employee
          </Button>
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
            <EmployeeItem key={employee.id} employee={employee} />
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
