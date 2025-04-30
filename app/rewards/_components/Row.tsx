import React from 'react'
import { RowProp } from '@/types/type'
import CouponCard from './CouponCard'
import { useDroppable } from '@dnd-kit/core'
import { useUser } from '@/context/UserContext'
import { cn } from '@/lib/utils'

const Row = ({ row, coupons, onApplyCoupons }: RowProp & { onApplyCoupons?: () => void }) => {
  const { user, addToWallet, deductPoints } = useUser();
  const { setNodeRef } = useDroppable({
    id: row.id,
  });

  const isWallet = row.id === 'WALLET';
  const isWalletEmpty = isWallet && coupons.length === 0;
  const hasCoupons = isWallet && coupons.length > 0;

  const totalPointsRequired = coupons.reduce((sum, coupon) => sum + coupon.pointsRequired, 0);
  const hasEnoughPoints = user.points >= totalPointsRequired;

  const handleApplyCoupons = () => {
    if (hasEnoughPoints) {
      coupons.forEach(coupon => {
        addToWallet(coupon);
      });
      deductPoints(totalPointsRequired);
      onApplyCoupons?.();
    }
    console.log("user in rewards>>", user)
  };

  return (
    <div className={`relative flex h-80 w-full flex-col rounded-lg p-4 ${isWallet ? 'border border-dashed border-black' : 'bg-[#ecd4c5]/30'}`}>
      {isWallet && (
        <div className='-z-10'>
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:60px_50px]",
              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
            )}
          />
        </div>
      )}
      <div ref={setNodeRef} className={`flex flex-auto flex-row gap-4 ${isWalletEmpty && 'items-center justify-center'}`}>
        {isWalletEmpty ? (
          <p className="text-gray-500 text-lg font-medium bg-white dark:bg-black p-6 rounded-full">DRAG and DROP a coupon here</p>
        ) : (
          coupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))
        )}
      </div>

      {hasCoupons && (
        <div className="mx-auto mt-5">
          <button
            onClick={handleApplyCoupons}
            disabled={!hasEnoughPoints}
            className={`px-4 py-2 text-white rounded-lg transition-colors shadow-md capitalize ${hasEnoughPoints
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            {hasEnoughPoints ? 'Add to Your Wallet' : 'Not enough points'}
          </button>
          {!hasEnoughPoints && (
            <p className="text-sm text-red-500 mt-2 text-center">
              You need {totalPointsRequired - user.points} more points
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Row