import useAuthStore from "../../services/stores/authStore";
import Routes from "../Routes";
import Sidebar from "../../components/sidebar";

const Views = () => {
  const { role } = useAuthStore();

  return (
    <div
      className={`flex flex-row min-h-screen h-dvh overflow-hidden bg-[var(--background-color)]`}
    >
      <div className="min-h-screen">
        <Sidebar role={role} />
      </div>

      <main className={`flex-1 flex flex-col overflow-auto`}>
        <div className="flex-1 text-[var(--dark-color)]">
          <Routes />
        </div>
      </main>
    </div>
  );
};

export default Views;
