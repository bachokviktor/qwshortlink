import { useTranslation } from "react-i18next"
import "../i18n"

interface PropsInterface {
  deleteLinkId: number | null;
  setDeleteLinkId: (value: number | null) => void;
  setIsDeletingLink: (value: boolean) => void;
  deleteLink: (id: number | null) => void;
}

function LinkDelete({deleteLinkId, setDeleteLinkId, setIsDeletingLink, deleteLink}:PropsInterface) {
  const {t} = useTranslation()

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("linkDeleteTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
	<h2>{t("linkDeleteHeader")}</h2>
	<p>{t("linkDeleteBody")}</p>

	<div className="fl-gap fl-wrap">
	  <button className="btn btn-danger fl-grow" onClick={() => deleteLink(deleteLinkId)}>{t("linkDeleteSubmit")}</button>
	  <button className="btn btn-neutral fl-grow" onClick={() => {setDeleteLinkId(null); setIsDeletingLink(false)}}>{t("linkDeleteCancel")}</button>
	</div>
      </div>
    </div>
  )
}

export default LinkDelete
