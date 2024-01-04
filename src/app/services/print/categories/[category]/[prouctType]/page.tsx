import React from "react";

interface Props {
  params: {
    category: string;
    productType: string;
  };
}

const ProductType = ({ params }: Props) => {
  // params: { category: 'categoryID', prouctType: 'productType' }
  console.log(params);

  return (
    <div>
      {/* <>print / Category / Product Type </> */}
      <>print / T-Shirts and Apparels / T-Shirts </>
      <br />
      Product Type
    </div>
  );
};

export default ProductType;
