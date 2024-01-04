import PrintCategory from "@/features/services/PrintCategory";
import React from "react";

interface Props {
  params: {
    category: string;
  };
}
const PrintCategoryPage = ({ params }: Props) => {
  return (
    <div>
      {/* <>print / Category </> */}
      <>print / T-Shirts and Apparels </>
      <br />
      Print Category: {params.category}
      <PrintCategory />
    </div>
  );
};

export default PrintCategoryPage;
