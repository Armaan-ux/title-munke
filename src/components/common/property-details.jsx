import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
const PropertyDetails = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-md  text-secondary">Back</p>
        </div>
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-[#4C0D0D]">
                  2868 reading rd, Lehigh, Pennsylvania
                </h2>
                <p className="text-[13px] text-[#8B8686] mt-1">
                  Searched on:{" "}
                  <span className="font-semibold text-[#4C0D0D]">
                    Oct 7, 2025
                  </span>{" "}
                  | Reference ID:{" "}
                  <span className="font-semibold text-[#4C0D0D]">
                    SR-230145
                  </span>
                </p>
              </div>
              <Badge className="bg-[#EAF7ED] text-[#3A9447] text-[13px] font-medium px-3 py-1 rounded-full">
                Completed
              </Badge>
            </div>

            <hr className="my-6 border-t border-[#F1EDEA]" />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
              <div>
                <h3 className="font-semibold text-[15px] text-[#4C0D0D] mb-2">
                  Description
                </h3>

                <div className="grid grid-cols-3 gap-3 text-[13px] text-[#4C0D0D]">
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-[#7A7676]">
                      Reading Rd, west of College
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Lots</p>
                    <p className="text-[#7A7676]">#91 (W 34 ft), #92 (all)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Area</p>
                    <p className="text-[#7A7676]">Allentown, Lehigh County</p>
                  </div>
                  <div>
                    <p className="font-semibold">Property</p>
                    <p className="text-[#7A7676]">2868 reading rd</p>
                  </div>
                  <div>
                    <p className="font-semibold">County, State</p>
                    <p className="text-[#7A7676]">Lehigh, Pennsylvania</p>
                  </div>
                  <div>
                    <p className="font-semibold">Municipality</p>
                    <p className="text-[#7A7676]">City of Allentown</p>
                  </div>
                  <div>
                    <p className="font-semibold">PIN/Parcel</p>
                    <p className="text-[#7A7676]">54869339781</p>
                  </div>
                  <div>
                    <p className="font-semibold">Span of Search</p>
                    <p className="text-[#7A7676]">60 years</p>
                  </div>
                  <div>
                    <p className="font-semibold">Date of Search</p>
                    <p className="text-[#7A7676]">September 09, 2025</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    <div className="border border-[#F1EDEA] rounded-lg p-2">
                      <p className="font-semibold">Current Owner</p>
                      <p className="text-[#7A7676]">Congommen Holdings, LLC</p>
                    </div>
                    <div className="border border-[#F1EDEA] rounded-lg p-2">
                      <p className="font-semibold">Tax Assessment</p>
                      <p className="text-[#7A7676]">$162900</p>
                    </div>
                  </div>

                  <div className="border border-[#F1EDEA] rounded-lg p-2 text-[13px]">
                    <p className="font-semibold">Title Deed</p>
                    <p className="text-[#7A7676]">
                      Deed recorded on 8/7/2024 at 3:29:18 PM
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-semibold text-[15px] text-[#4C0D0D] mb-3">
                    Document Processing Status
                  </h3>

                  <div className="overflow-hidden border border-[#F1EDEA] rounded-xl">
                    <table className="w-full text-[13px]">
                      <thead className="bg-[#F9F6F4] text-[#4C0D0D] font-semibold text-left">
                        <tr>
                          <th className="py-3 px-4">Sr. No.</th>
                          <th className="py-3 px-4">Document Type</th>
                          <th className="py-3 px-4">Date Recorded</th>
                          <th className="py-3 px-4">Document ID</th>
                          <th className="py-3 px-4">Progress</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            no: "01.",
                            type: "Document 01",
                            date: "01 Oct 2025",
                            id: "DOC-9081",
                          },
                          {
                            no: "02.",
                            type: "Document 02",
                            date: "01 Oct 2025",
                            id: "DOC-9082",
                          },
                          {
                            no: "03.",
                            type: "Document 03",
                            date: "30 Sep 2025",
                            id: "DOC-9075",
                          },
                        ].map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-[#F1EDEA] text-[#4C0D0D]"
                          >
                            <td className="py-3 px-4">{item.no}</td>
                            <td className="py-3 px-4">{item.type}</td>
                            <td className="py-3 px-4">{item.date}</td>
                            <td className="py-3 px-4">{item.id}</td>
                            <td className="py-3 px-4">
                              <div className="w-[100px] bg-[#EAF7ED] rounded-full h-[6px] overflow-hidden">
                                <div className="bg-[#3A9447] h-[6px] w-[90%] rounded-full"></div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Eye className="w-4 h-4 text-[#4C0D0D]" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden border border-[#F1EDEA]">
                  <img
                    src="/property.png"
                    alt="Property"
                    width={300}
                    height={270}
                    className="object-cover w-full h-[270px]"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-[#F1EDEA]">
                  <img
                    src="/map-geo.png"
                    alt="Map"
                    width={300}
                    height={270}
                    className="object-cover w-full h-[270px]"
                  />
                </div>
              </div>
            </div>

            <hr className="my-6 border-t border-[#F1EDEA]" />
            <div className="flex justify-between items-center mt-4 text-[13px]">
              <p className="text-[#4C0D0D]">
                Documents Completed:{" "}
                <span className="font-semibold">3 of 3</span>
                <br />
                Status:{" "}
                <span className="text-[#3A9447] font-semibold">Completed</span>
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border border-[#4C0D0D] text-[#4C0D0D] hover:bg-[#4C0D0D]/5 px-5 rounded-lg"
                >
                  Download CSV
                </Button>
                <Button className="bg-[#4C0D0D] text-white hover:bg-[#4C0D0D]/90 px-5 rounded-lg">
                  Download All as ZIP
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
