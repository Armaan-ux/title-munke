import { deleteProduct } from '@/components/service/userAdmin'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import React from 'react'

const PricingDetailsHeader = ({product}) => {
  const deleteUserMutation = useMutation({
        mutationFn: (productId) => deleteProduct(productId),
        onSuccess: () => {}
    })
const deleteHandler = (productId) => {
deleteUserMutation.mutate(productId)
}
  return (
      <div className="w-full bg-[#F3EEE8] border border-[#E6DED5] rounded-lg px-6 py-4 flex items-center justify-between mt-6">
      
      {/* Left Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <p className="text-xl font-semibold text-[#3C2F2F]">
            Professional Plan
          </p>

          <span className="text-xs px-2 py-1 rounded-md bg-[#E8DED3] text-[#6B5B4D]">
            Subscription
          </span>
        </div>

        <p className="text-sm text-[#7A6F66]">
          $7.50 <span className="mx-1">/</span> Search Cost
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* <Button className="bg-[#6E0B0B] hover:bg-[#5a0909] text-white text-sm px-4 py-2 rounded-md font-medium">
          Upgrade Plan
        </Button> */}

        <Button className="flex items-center gap-2 bg-[#F3EEE8] border border-[#E2D8CF] text-[#7A6F66] text-sm px-4 py-2 rounded-md hover:bg-[#F5F1ED]" onClick={() => deleteHandler(product?.id)}>
          <Trash2 size={16} />
          Delete Plan
        </Button>
      </div>
    </div>
  )
}

export default PricingDetailsHeader