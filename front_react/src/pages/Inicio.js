
import MainLayout from "../components/MainLayout";
import HomePage from "./HomePage/HomePage";

const Inicio = ({usuario}) => {

  return (
    <div>
       <MainLayout>
          <HomePage />
       </MainLayout>
    </div>
  );
}

export default Inicio

