import React from "react";

interface Props {
  params: {
    slug: string;
  };
}

const ProductDetails = ({ params: { slug } }: Props) => {
  console.log(slug);
  return (
    <div>
      {/* <>print / Category / Product Type / Product Name </> */}
      <>print / T-Shirts and Apparels / Hoodies / Black T-shirt </>
      <br />
      Product details
    </div>
  );
};

export default ProductDetails;
