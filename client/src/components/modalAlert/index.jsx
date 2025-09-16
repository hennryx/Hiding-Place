import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaQuestionCircle, FaExclamationTriangle } from "react-icons/fa"

import { createRoot } from "react-dom/client"
import { useState } from "react"

function AlertDialog({ options, resolve }) {
    const [open, setOpen] = useState(true)

    const handleClose = (action) => {
        setOpen(false)
        resolve(action)
    }

    return (
        <Dialog open={open} onClose={() => handleClose("cancel")} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl p-6">
                    <div className="flex items-start space-x-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgSelector(options.icon)}`}>
                            <IconSelector icon={options.icon} />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-black">{options.title ?? "Alert"}</DialogTitle>
                            <p className="mt-2 text-sm text-gray-600">{options.text ?? ""}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        {options.showCancel && (
                            <button
                                onClick={() => handleClose("cancel")}
                                className="rounded-md bg-gray-100 text-black px-4 py-2 text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={() => handleClose("confirm")}
                            className="rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm text-white hover:bg-[var(--primary-hover-color)]"
                        >
                            {options.confirmText ?? "OK"}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

const bgSelector = (icon) => {
    console.log(icon);
    
    switch (icon) {
        case "success":
            return "bg-green-100"
        case "error":
            return "bg-red-100"
        case "info":
            return "bg-blue-100"
        case "question":
            return "bg-blue-100"
        case "warning":
            return "bg-yellow-100"
        default:
            return "bg-yellow-100"
    }
}

function IconSelector({ icon }) {
    switch (icon) {
        case "success":
            return <FaCheckCircle className="h-6 w-6 text-green-600" />
        case "error":
            return <FaTimesCircle className="h-6 w-6 text-red-600" />
        case "info":
            return <FaInfoCircle className="h-6 w-6 text-blue-600" />
        case "question":
            return <FaQuestionCircle className="h-6 w-6 text-blue-400" />
        case "warning":
            return <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
        default:
            return <FaExclamationTriangle className="h-6 w-6 text-gray-600" />
    }
}

export function NAL(options) {
    return new Promise((resolve) => {
        const div = document.createElement("div")
        document.body.appendChild(div)
        const root = createRoot(div)

        const cleanup = () => {
            root.unmount()
            div.remove()
        }

        const wrappedResolve = (action) => {
            if (action === "confirm") {
                resolve({ isConfirmed: true, isDismissed: false })
              } else {
                resolve({ isConfirmed: false, isDismissed: true })
              }
            setTimeout(cleanup, 200)
        }

        root.render(<AlertDialog options={options} resolve={wrappedResolve} />)
    })
}
