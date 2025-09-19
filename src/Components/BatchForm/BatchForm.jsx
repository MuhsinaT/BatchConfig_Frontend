import React, { useState } from "react";
import axios from "axios";
import './BatchFrom.css'
import Swal from "sweetalert2";
import { meta } from "@eslint/js";


function BatchForm() {
    const [formData, setFormData] = useState({
        batchName: "",
        numberOfStudents: "",
        numberOfClassesPerMonth: "",
        course: "",
        medium: "",
    });

    const Batch_url = import.meta.env.VITE_BATCH_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${Batch_url}/batches`, formData);
            console.log(res)
            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Batch created successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });
                setFormData({
                    batchName: "",
                    numberOfStudents: "",
                    numberOfClassesPerMonth: "",
                    course: "",
                    medium: "",
                });

            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || " Error updating fee rule",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    };

    return (

        <div className="form-main">
            <div className="container">
                <h2>Batch Details</h2>

                <form onSubmit={handleSubmit} >

                    <div className="from-inputs-main">

                        <div className="form-input">
                            <label htmlFor="">Batch Name</label>
                            <input
                                type="text"
                                name="batchName"
                                value={formData.batchName}
                                onChange={handleChange}
                                placeholder="Batch Name"
                                required
                            />
                        </div>


                        <div className="form-input">
                            <label htmlFor="">Number Of Students</label>
                            <input
                                type="number"
                                name="numberOfStudents"
                                value={formData.numberOfStudents}
                                onChange={handleChange}
                                placeholder="Number of Students"
                                required
                            />

                        </div>


                        <div className="form-input">
                            <label htmlFor="">Number Of Classes Per Month</label>
                            <input
                                type="number"
                                name="numberOfClassesPerMonth"
                                value={formData.numberOfClassesPerMonth}
                                onChange={handleChange}
                                placeholder="Number of Classes per Month"
                                required
                            />
                        </div>


                        <div className="form-input">
                            <label htmlFor="">Courses</label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Course</option>
                                <option value="Math">Math</option>
                                <option value="Science">Science</option>
                                <option value="English">English</option>
                            </select>
                        </div>



                        <div className="form-input">
                            <label htmlFor="">Medium</label>
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

                        <button type="submit" className="save-btn">Save</button>

                    </div>
                </form>
            </div>

        </div>


    );
}

export default BatchForm;
