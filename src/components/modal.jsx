import axios from "axios";
import Field from "./filed";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  isModelOpen,
  setIsModelOpen,
  setContacts,
  editItem,
  setEditItem,
}) => {
  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Javascript içerisinde bulunan FormData yapısı sayesinde forma eriştik
    const formData = new FormData(e.target);

    // Erişilen bu form içerisindeki değerleri alıp önce entries metoduyla diziye sonrasında Object.fromEntries ile diziye çevirdik. Bu sayede formun gönderilmesiyle bir kişi objesi elde ettik
    const newContact = Object.fromEntries(formData.entries());

    try {
      if (!editItem) {
        // Formdan alınan değerler ile api'a verileri gönder
        const response = await axios.post("/contact", newContact);
        setContacts((contacts) => [...contacts, response.data]);
      } else {
        // Edit item kısmındaki verilerle kişiyi api'da güncelle
        const response = await axios.put(`/contact/${editItem.id}`, newContact);
        setContacts((contacts) =>
          contacts.map((contact) =>
            contact.id === editItem.id ? response.data : contact
          )
        );
        setEditItem(null);
      }
      // Modal'ı kapat
      setIsModelOpen(() => false);
    } catch (err) {
      // Hata durumunda kullanıcıya mesaj göster
      alert(`İşlem gerçekleştirilemedi`);
      console.log(`Hataaa: ${err}`);
    }
  };

  return (
    isModelOpen && (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-head">
            <h2>{editItem ? "Kişiyi Güncelle" : "Yeni Kişi Ekle"}</h2>
            <button onClick={() => setIsModelOpen(false)}>
              <IoMdClose />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <Field value={editItem?.name} label="İsim Soyisim" name="name" />
            <Field
              value={editItem?.position}
              label="Pozisyon"
              name="position"
            />
            <Field value={editItem?.company} label="Şirket" name="company" />
            <Field value={editItem?.phone} label="Telefon" name="phone" />
            <Field value={editItem?.email} label="Email" name="email" />
            <div className="buttons" name="name">
              <button type="button" onClick={() => setIsModelOpen(false)}>
                Vazgeç
              </button>
              <button type="submit">Gönder</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Modal;
