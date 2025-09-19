import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FeeForm.css";
import Swal from "sweetalert2";

function FeeForm() {
    const [formData, setFormData] = useState({
        batchId: "",
        noOfStudentsMin: "",
        noOfStudentsMax: "",
        region: "",
        medium: "",
        course: "",
        monthlyFee: "",
        totalClasses: "",
        negotiableFee: "",
        discount: "",
        remarks: "",
    });

    const Batch_url = import.meta.env.VITE_BATCH_URL;

    const [feeRules, setFeeRules] = useState([]);
    const [batches, setBatches] = useState([]);

    // Modals
    const [selectedRule, setSelectedRule] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [batchFee, setBatchFee] = useState({
        category: "",
        feeAmount: "",
        discount: "",
    });
    const [configureDiscount, setConfigureDiscount] = useState(false);
    const modalRef = useRef(null)

    useEffect(() => {
        fetchBatches();
        fetchAllFeeRules();
    }, []);

    // fetch batches
    const fetchBatches = async () => {
        try {
            const res = await axios.get(`${Batch_url}/batches`);
            setBatches(res.data);
        } catch (err) {
            console.error("Error fetching batches:", err);
        }
    };

    // Fetch all fee rules
    const fetchAllFeeRules = async () => {
        try {
            const res = await axios.get(`${Batch_url}/fees`);
            setFeeRules(res.data);
        } catch (err) {
            console.error("Error fetching fee rules:", err);
        }
    };

    // Handle form change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add new rule
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${Batch_url}/fees`, formData);
            if (res.status === 200) {
                // alert("✅ Fee rule created successfully!");
                Swal.fire({
                    icon: "success",
                    title: "Fee rule created successfully!",
                    toast: true,
                    position: "top-end",   // instead of top-right
                    showConfirmButton: false,
                    timer: 3000,
                });
                fetchAllFeeRules();

                setFormData({
                    batchId: "",
                    noOfStudentsMin: "",
                    noOfStudentsMax: "",
                    region: "",
                    medium: "",
                    course: "",
                    monthlyFee: "",
                    totalClasses: "",
                    negotiableFee: "",
                    discount: "",
                    remarks: "",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "❌ Error creating fee rule",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    };

    // Row click -> set data for Batch Fee Config
    const openDiscountModal = (rule) => {
        setSelectedRule(rule);
    };

    // Edit rule
    const openEditModal = (rule) => {
        setSelectedRule(rule);
        setEditFormData({
            batchId: rule.batchId?._id || "",
            noOfStudentsMin: rule.noOfStudentsMin || "",
            noOfStudentsMax: rule.noOfStudentsMax || "",
            region: rule.region || "",
            medium: rule.medium || "",
            course: rule.course || "",
            monthlyFee: rule.monthlyFee || "",
            totalClasses: rule.totalClasses || "",
            negotiableFee: rule.negotiableFee || "",
            discount: rule.discount || "",
            remarks: rule.remarks || "",
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                `${Batch_url}/fees/${selectedRule._id}`,
                editFormData
            );
            console.log(res.data)
            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Fee rule updated successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });
                modalRef.current.click()
                fetchAllFeeRules();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "❌ Error updating fee rule",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    };

    // Delete rule
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axios.delete(`${Batch_url}/fees/${id}`);
            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                fetchAllFeeRules();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "❌ Error deleting rule",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    // Submit Batch Fee Config
    const handleSubmitBatchFee = async (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: "Batch Fee Configuration Saved!",
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false

        })
    };

    return (
        <div className="feeform">
            <div className="container">
                <h2>Add Fee Structure</h2>

                {/* Add Form */}
                <div className="fee-structure" id="fee-structure">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="">Fee Structure Name</label>
                                <select
                                    name="batchId"
                                    value={formData.batchId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a Batch</option>
                                    {batches.map((batch) => (
                                        <option key={batch._id} value={batch._id}>
                                            {batch.batchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label>No.Of Students(min)</label>
                                <input
                                    type="number"
                                    name="noOfStudentsMin"
                                    value={formData.noOfStudentsMin}
                                    onChange={handleChange}
                                    placeholder="No. of Students (Min)"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label>No.Of Students (Max)</label>
                                <input
                                    type="number"
                                    name="noOfStudentsMax"
                                    value={formData.noOfStudentsMax}
                                    onChange={handleChange}
                                    placeholder="No. of Students (Max)"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Region</label>
                                <select
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Region</option>
                                    <option value="North">North</option>
                                    <option value="South">South</option>
                                    <option value="East">East</option>
                                    <option value="West">West</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label>Medium</label>
                                <select
                                    name="medium"
                                    value={formData.medium}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Medium</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label>Course</label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Course</option>
                                    <option value="Maths">Maths</option>
                                    <option value="Science">Science</option>
                                    <option value="Computer">Computer</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label>MonthlyFee</label>
                                <input
                                    type="number"
                                    name="monthlyFee"
                                    value={formData.monthlyFee}
                                    onChange={handleChange}
                                    placeholder="Monthly Fee (INR)"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Total Classes</label>
                                <input
                                    type="number"
                                    name="totalClasses"
                                    value={formData.totalClasses}
                                    onChange={handleChange}
                                    placeholder="Total Classes in Month"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Remarks</label>
                                <input
                                    type="number"
                                    name="negotiableFee"
                                    value={formData.negotiableFee}
                                    onChange={handleChange}
                                    placeholder="Negotiable Fee (Min 800)"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    Update
                                </button>
                                <button type="button" className="btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <hr style={{ margin: "70px 0" }} />
                <div className="structure-table">

                    {/* Table */}
                    {/* <button className="add-btn"> +Add</button> */}
                    <a href="#fee-structure" className="add-btn">+Add</a>

                    <h2 className="fee-title">Fee Structure ({feeRules.length})</h2>

                    {feeRules.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Fee Structure</th>
                                    <th>Region</th>
                                    <th>Course</th>
                                    <th>Medium</th>
                                    <th>Monthly Fee</th>
                                    <th>Remarks</th>
                                    <th>Total Classes</th>
                                    <th>Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeRules.map((rule) => (
                                    <tr
                                        key={rule._id}
                                        data-bs-toggle="modal"
                                        data-bs-target="#discountModal"
                                        onClick={() => openDiscountModal(rule)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{rule.batchId.batchName}</td>
                                        <td>{rule.region}</td>
                                        <td>{rule.course}</td>
                                        <td>{rule.medium}</td>
                                        <td>{rule.monthlyFee}</td>
                                        <td>{rule.negotiableFee}</td>
                                        <td>{rule.totalClasses}</td>
                                        <td>
                                            {rule.noOfStudentsMin} - {rule.noOfStudentsMax}
                                        </td>
                                        <td>
                                            <div className="action-main">
                                                <button
                                                    className="actions"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editModal"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(rule);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="actions"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(rule._id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No fee rules found.</p>
                    )}
                </div>

                {/* Discount Modal */}
                <div
                    className="modal fade"
                    id="discountModal"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Batch Fee Config</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body">
                                {selectedRule && (
                                    <p>
                                        <b>Region:</b> {selectedRule.region}
                                    </p>
                                )}

                                <form onSubmit={handleSubmitBatchFee} className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Fee Structure Category</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={batchFee.category}
                                            onChange={(e) =>
                                                setBatchFee({ ...batchFee, category: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Fee Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={batchFee.feeAmount}
                                            onChange={(e) =>
                                                setBatchFee({ ...batchFee, feeAmount: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="configureDiscountCheck"
                                                checked={configureDiscount}
                                                onChange={(e) => setConfigureDiscount(e.target.checked)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="configureDiscountCheck"
                                            >
                                                Configure discount?
                                            </label>
                                        </div>
                                    </div>

                                    {configureDiscount && (
                                        <div className="col-md-6">
                                            <label className="form-label">Discount %</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={batchFee.discount}
                                                onChange={(e) =>
                                                    setBatchFee({ ...batchFee, discount: e.target.value })
                                                }
                                            />
                                        </div>
                                    )}

                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                <div
                    className="modal fade"
                    id="editModal"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Edit Fee Rule</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedRule && (
                                    <form onSubmit={handleEditSubmit} className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Batch</label>
                                            <select
                                                className="form-control"
                                                name="batchId"
                                                value={
                                                    editFormData.batchId ||
                                                    selectedRule?.batchId?._id ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        batchId: e.target.value,
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">Select a Batch</option>
                                                {batches.map((batch) => (
                                                    <option key={batch._id} value={batch._id}>
                                                        {batch.batchName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Region</label>
                                            <select
                                                className="form-select"
                                                value={editFormData.region || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        region: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">Select Region</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Medium</label>
                                            <select
                                                className="form-select"
                                                value={editFormData.medium || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        medium: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">Select Medium</option>
                                                <option value="English">English</option>
                                                <option value="Hindi">Hindi</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Course</label>
                                            <select
                                                className="form-select"
                                                value={editFormData.course || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        course: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">Select Course</option>
                                                <option value="Maths">Maths</option>
                                                <option value="Science">Science</option>
                                                <option value="Computer">Computer</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Monthly Fee</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editFormData.monthlyFee || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        monthlyFee: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Number Of Students (Min)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editFormData.noOfStudentsMin || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        noOfStudentsMin: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Number Of Students (Max)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editFormData.noOfStudentsMax || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        noOfStudentsMax: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Negotiable Fee</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editFormData.negotiableFee || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        negotiableFee: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Total Classes</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editFormData.totalClasses || ""}
                                                onChange={(e) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        totalClasses: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="modal-footer">
                                            <button type="submit" className="btn btn-primary">
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeeForm;
