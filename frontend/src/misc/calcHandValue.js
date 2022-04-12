const calcHandValue = arr => {
  let hasAce = false
  const total = arr.reduce(
    (prev, curr) => {
      try {
        const firstChar = parseInt(curr.charAt(0), 10)
        if (Number.isInteger(firstChar) && firstChar >= 2) {
          return prev + firstChar
        }
        if (curr.charAt(0) === 'A') {
          hasAce = true
          return prev
        }
      } catch {
        return prev + 10
      }
      return prev + 10
    },
    0,
  )
  if (hasAce && total <= 10) {
    return total + 11
  }
  if (hasAce) {
    return total + 1
  }

  return total
}

export default calcHandValue
