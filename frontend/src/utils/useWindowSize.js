import { useEffect, useState } from "react"

export const useWindowSize = () =>{
    const [size, setSize] = useState([window.innerWidth, window.innerHeight])

    // each time the window size is changed, the height and width are updated
    useEffect(() => {
            const updateSize = () => {
                setSize([window.innerWidth, window.innerHeight])
            }

            window.addEventListener('resize', updateSize)

            return () => window.removeEventListener('resize', updateSize)
    }, [])

    return {
        width: size[0],
        height: size[1]
    }
}