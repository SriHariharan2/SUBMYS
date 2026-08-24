import Navbar from "../../components/layout/Navbar";

import { useAuth } from "../../context/AuthContext";

function Dashboard() {

    const { user } = useAuth();

    return (

        <div>

            <Navbar />

            <div className="container mt-5">

                <h2>

                    Welcome,

                    {user?.name}

                </h2>

                <h4>

                    Role:

                    {user?.role}

                </h4>

                <p>

                    Student Dashboard

                </p>

            </div>

        </div>

    );

}

export default Dashboard;