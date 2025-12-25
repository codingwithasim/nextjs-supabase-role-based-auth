import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "focus-visible:border-ring",
        error:
          "text-red-500 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-300 selection:bg-red-500 placeholder:text-red-400",
        filled: "bg-accent shadow-none",
        underlined: "rounded-sm rounded-b-none border-transparent bg-accent border-b-gray-500",
      },
      size: {
        sm: "h-8 py-1 text-sm",
        md: "h-10 py-2 text-sm",
        lg: "h-12 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    icon?: IconType
    iconPosition?: "left" | "right"
    supportingText?: React.ReactNode
    errorText?: React.ReactNode
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    wrapperClassName?: string
    onIconClick?: ()=> void
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    wrapperClassName,
    supportingText,
    errorText,
    prefix,
    suffix,
    variant,
    size,
    icon: Icon,
    iconPosition = "left",
    onIconClick,
    type = "text",
    id: idProp,
    ...rest
  },
  ref
) {
  const generatedId = React.useId()
  const inputId = idProp ?? generatedId

  const {
    ["aria-invalid"]: ariaInvalidProp,
    style: inputStyleProp,
    ...inputRest
  } = rest as React.ComponentProps<"input"> & {
    "aria-invalid"?: React.AriaAttributes["aria-invalid"]
    style?: React.CSSProperties
  }
  const isIconLeft = Icon && iconPosition === "left" && !prefix
  const isIconRight = Icon && iconPosition === "right" && !suffix
  const describedByIds: string[] = []
  const errorId = errorText ? `${inputId}-error` : undefined
  const supportId = supportingText ? `${inputId}-support` : undefined

  if (errorId) describedByIds.push(errorId)
  if (supportId) describedByIds.push(supportId)

  const isError =
    ariaInvalidProp === true || ariaInvalidProp === "true" || variant === "error" || !!errorText

  const prefixRef = React.useRef<HTMLSpanElement>(null)
  const suffixRef = React.useRef<HTMLSpanElement>(null)
  const [prefixWidth, setPrefixWidth] = React.useState(0)
  const [suffixWidth, setSuffixWidth] = React.useState(0)

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

  useIsomorphicLayoutEffect(() => {
    const element = prefixRef.current
    if (!element) {
      setPrefixWidth(0)
      return
    }

    const update = () => setPrefixWidth(element.offsetWidth)
    update()

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => update())
      observer.observe(element)
      return () => observer.disconnect()
    }

    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [prefix])

  useIsomorphicLayoutEffect(() => {
    const element = suffixRef.current
    if (!element) {
      setSuffixWidth(0)
      return
    }

    const update = () => setSuffixWidth(element.offsetWidth)
    update()

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => update())
      observer.observe(element)
      return () => observer.disconnect()
    }

    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [suffix])

  const computedStyle = React.useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = { ...inputStyleProp }

    if (prefix && prefixWidth) {
      style.paddingLeft = `calc(${prefixWidth}px + 0.75rem)`
    } else if (isIconLeft && style.paddingLeft === undefined) {
      style.paddingLeft = "2.25rem"
    }

    if (suffix && suffixWidth) {
      style.paddingRight = `calc(${suffixWidth}px + 0.75rem)`
    } else if (isIconRight && style.paddingRight === undefined) {
      style.paddingRight = "2.25rem"
    }

    return style
  }, [inputStyleProp, prefix, prefixWidth, suffix, suffixWidth, isIconLeft, isIconRight])

  return (
    <div className={wrapperClassName}>
      <div className="relative flex items-center">
        {prefix && (
          <span
            ref={prefixRef}
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-3 text-sm text-muted-foreground"
          >
            {prefix}
          </span>
        )}
        {isIconLeft && Icon && (
          <Icon
            onClick={onIconClick}
            className={cn(
              "absolute left-3 size-4",
              isError ? "text-red-400" : "text-muted-foreground"
            )}
          />
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          data-slot="input"
          aria-invalid={ariaInvalidProp ?? (isError ? true : undefined)}
          aria-describedby={describedByIds.length ? describedByIds.join(" ") : undefined}
          className={cn(
            inputVariants({ variant, size }),
            className
          )}
          style={computedStyle}
          {...inputRest}
        />
        {suffix && (
          <span
            ref={suffixRef}
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-3 pr-3 text-sm text-muted-foreground"
          >
            {suffix}
          </span>
        )}
        {isIconRight && Icon && (
          <Icon
            onClick={onIconClick}
            className={cn(
              "absolute right-3 size-4",
              isError ? "text-red-400" : "text-muted-foreground"
            )}
          />
        )}
      </div>
      {isError && errorText ? (
        <p id={errorId} className="mt-2 text-xs text-red-500">
          {errorText}
        </p>
      ) : supportingText ? (
        <p id={supportId} className="mt-2 text-xs text-muted-foreground">
          {supportingText}
        </p>
      ) : null}
    </div>
  )
})

Input.displayName = "Input"

export { Input }
