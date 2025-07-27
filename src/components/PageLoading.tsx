import { ScaleLoader } from "react-spinners";

const PageLoading = ({ isAbsolute }: { isAbsolute?: boolean }) => {
  return (
    <div className={`flex items-center justify-center ${isAbsolute ? 'absolute' : 'fixed'} top-0 left-0 right-0 bottom-0 bg-[#fff]`}>
      <div>
        <ScaleLoader color="oklch(0.145 0 0)" loading={true} />
      </div>
    </div>
  );
};

export default PageLoading;