import Productlisting from "@/src/components/Product/Productlisting";
import Productrecommend from "@/src/components/Product/Recommended/Productrecommend";

export default function Home() {
  return (
   <div>
    <Productlisting />
    <Productrecommend />
   </div>
  );
}
