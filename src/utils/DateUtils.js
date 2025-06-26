const formatDate = (date, style = 'dd/mm/yyyy') => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  switch (style) {
    case 'dd/mm/yyyy hh:mm':
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

export default {
  formatDate
}