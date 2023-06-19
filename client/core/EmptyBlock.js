import React from "react"
import { useMediaQuery } from "react-responsive"
import EmptyImg from "./EmptyImg.js"

const EmptyBlock = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 })

  return (
    <section>
      <div className="d-flex flex-column align-items-center">
        <div className={isMobile ? "w-50" : "w-25"}>
          <EmptyImg />
        </div>
        <h2 className="text-center mt-1 mt-xl-3">Здесь пока ничего нет</h2>
        <p className="text-center mt-1 mt-xl-3">Возможно, скоро появится.</p>
      </div>
    </section>
  )
}

export default EmptyBlock
