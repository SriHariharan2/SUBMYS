import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {

    return (

        <div>

            <Navbar />

            <div className="d-flex">

                <Sidebar />

                <main
                    className="p-4 flex-grow-1"
                >

                    {children}

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;