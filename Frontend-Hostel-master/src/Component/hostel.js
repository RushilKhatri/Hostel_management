import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../css/hostel.css";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "./ErrorDisplay";

const HostelList = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    availability: "all",
    floor: "",
    hostelName: "",
    roomNumber: "",
  });

  useEffect(() => {
    if (localStorage.getItem("isLogin") !== "true") {
      return navigate("/");
    }

    const fetchHostels = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          return navigate("/");
        }

        const response = await axios.get("http://localhost:8080/hostel/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const fetchedHostels = response.data.map((data) => ({
            hostelid: data.id,
            hostelname: data.name,
            roomNumber: data.room,
            floor: data.floor,
            studentroll: data.student ? data.student.roll : "",
            studentname: data.student ? `${data.student.fname} ${data.student.lname}` : "",
            year: data.student ? data.student.year : "",
            availability: data.student ? "allocated" : "available",
          }));
          setHostels(fetchedHostels);
          setFilteredHostels(fetchedHostels);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchHostels();
  }, [navigate]);

  const applyFilters = useCallback(() => {
    let filtered = hostels;
    if (filters.availability !== "all") {
      filtered = filtered.filter(hostel => hostel.availability === filters.availability);
    }
    if (filters.floor) {
      filtered = filtered.filter(hostel => hostel.floor === parseInt(filters.floor));
    }
    if (filters.hostelName) {
      filtered = filtered.filter(hostel => hostel.hostelname.toLowerCase().startsWith(filters.hostelName.toLowerCase()));
    }
    if (filters.roomNumber) {
      filtered = filtered.filter(hostel => String(hostel.roomNumber).includes(String(filters.roomNumber)));
    }
    setFilteredHostels(filtered);
    setCurrentPage(1);
  }, [filters, hostels]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleUpdateRedirect = () => {
    window.location.href = "/Home/update";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHostels.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="mainhostel">
      <Header />
      <div className="container-room">
        <div className="filters row g-3 mb-3">
          <div className="col-md-3">
            <select
              name="availability"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Hostel Name"
              name="hostelName"
              value={filters.hostelName}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Floor"
              name="floor"
              value={filters.floor}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Room Number"
              name="roomNumber"
              value={filters.roomNumber}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
          <div className="row">
            {currentItems.map((hostel) => (
              <div key={hostel.hostelid} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{hostel.hostelname}</h5>
                    <p className="card-text">Floor: {hostel.floor}</p>
                    <p className="card-text">Room: {hostel.roomNumber}</p>
                    {hostel.availability === "allocated" && (
                      <>
                        <p className="card-text">Student: {hostel.studentname}</p>
                        <p className="card-text">Roll: {hostel.studentroll}</p>
                        <p className="card-text">Year: {hostel.year}</p>
                      </>
                    )}
                    <span className={`badge ${hostel.availability === "available" ? "bg-success" : "bg-danger"}`}>
                      {hostel.availability}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pagination mt-3 text-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`btn btn-outline-primary me-2 ${index + 1 === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-primary" onClick={handleUpdateRedirect}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelList;
