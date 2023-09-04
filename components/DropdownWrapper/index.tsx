import React, { useEffect, useRef } from 'react'

type Props = {
  setDropdown: (x: boolean) => void
  children: JSX.Element
}

const DropdownWrapper = ({ setDropdown, children }: Props) => {
  let dropdownContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener(
      'keydown',
      e => e.key === 'Escape' && setDropdown(false),
    )

    const mouseDownHandler = (e: any) => {
      if (
        !(
          dropdownContainerRef.current &&
          dropdownContainerRef.current.contains(e.target)
        )
      ) {
        setDropdown(false)
      } else {
        e.target.click()
      }
    }

    document.addEventListener('mousedown', mouseDownHandler)

    return () => {
      document.removeEventListener('keydown', e => e.key === 'Escape')
      document.removeEventListener('mousedown', mouseDownHandler)
    }
  }, [])

  return (
    <div ref={dropdownContainerRef} className="overflow-hidden h-fit w-fit">
      {children}
    </div>
  )
}

export default DropdownWrapper
