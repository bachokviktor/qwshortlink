import {Link} from "react-router"
import {useTranslation} from "react-i18next"
import "../i18n"

function NotFound() {
  const {t} = useTranslation()

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>404 - QWShortLink</title>

      <div className="fl-col fl-gap">
	<h2>{t("notFoundHeader")}</h2>
	<p>{t("notFoundBody")}</p>
	<Link to="/">{t("notFoundHome")}</Link>
      </div>
    </div>
  )
}

export default NotFound
