import React from "react"
import { useMediaQuery } from "react-responsive"
import blank_canvas from "../assets/images/blank_canvas.svg"
import { Image } from "react-bootstrap"

const EmptyBlock = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 })

  return (
    <section>
      <div className="d-flex flex-column align-items-center">
        <Image
          src={blank_canvas}
          className={isMobile ? "w-50" : "w-25"}
        />
        <h2 className="text-center mt-1 mt-xl-3">
          Здесь пока ничего нет
        </h2>
        <p className="text-center mt-1 mt-xl-3">
          Возможно, скоро появится.
        </p>
      </div>
    </section>
  )
}

export default EmptyBlock
