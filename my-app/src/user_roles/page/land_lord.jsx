import React, { useState, useRef } from "react";
import "../../App.css";
import {
  MapPin,
  ShieldAlert,
  Zap,
  CreditCard,
  CheckCircle2,
  Bed,
  Bath,
  Armchair,
  Wifi,
  Car,
  Camera,
  X,
  ImagePlus,
  Globe,
} from "lucide-react";

/* ===============================
   TYPES & OPTIONS
================================ */

// Removed TypeScript interface - this file is plain JavaScript (JSX)

const RoomTypes = ["Single", "Double", "Shared"];
const Categories = ["Male", "Female", "Family"];
const UtilityOptions = ["Included", "Excluded"];
const BathroomOptions = ["Private", "Shared"];
const WifiOptions = ["Available", "Not Available"];
const ParkingOptions = ["Yes", "No"];
const AcOptions = ["Available", "Not Available"];
const FurnitureOptions = ["Bed", "Table", "Chair", "Cupboard"];

/* ===============================
   HEADER
================================ */

const Header = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Upload Your Room Details
      </h1>
    </div>
  );
};

/* ===============================
   PANORAMA
================================ */

const PanoramaSection = ({ panorama, onUpload }) => {
  const ref = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) onUpload(URL.createObjectURL(file));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Globe className="text-blue-500" /> 360° View
      </h2>

      <button
        onClick={() => ref.current?.click()}
        className="border px-6 py-2 rounded-lg text-blue-600"
      >
        Upload Panorama
      </button>

      <input
        type="file"
        hidden
        ref={ref}
        accept="image/*"
        onChange={handleChange}
      />

      {panorama && (
        <img
          src={panorama}
          className="w-64 rounded-xl border"
          alt="panorama"
        />
      )}
    </section>
  );
};

/* ===============================
   ROOM INFO
================================ */

const RoomInfoSection = ({ data, setData }) => {
  const handleSelect = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const toggleFurniture = (item) => {
    const exists = data.furniture.includes(item);

    const updated = exists
      ? data.furniture.filter((f) => f !== item)
      : [...data.furniture, item];

    setData({ ...data, furniture: updated });
  };

  const TickBox = ({ label, selected, onClick, icon: Icon }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 border rounded-xl w-full flex justify-between ${
        selected
          ? "bg-cyan-50 border-cyan-500 text-cyan-700"
          : "bg-slate-50 border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </div>

      {selected && <CheckCircle2 size={18} className="text-cyan-600" />}
    </button>
  );

  return (
    <div className="space-y-12">
      {/* BASIC INFO */}
      <section className="space-y-6">
        <h2 className="font-bold text-xl flex gap-2">
          <CreditCard /> Basic Info
        </h2>

        <label className="block font-semibold mb-2">Room Title</label>
        <input
          placeholder="Room Title"
          className="w-full p-3 border rounded-xl"
          value={data.roomTitle}
          onChange={(e) =>
            setData({ ...data, roomTitle: e.target.value })
          }
        />

        <div className="relative">
          <MapPin className="absolute left-3 top-3" />
          <input
            placeholder="Location"
            className="w-full p-3 pl-10 border rounded-xl"
            value={data.roomLocation}
            onChange={(e) =>
              setData({ ...data, roomLocation: e.target.value })
            }
          />
        </div>

        <input
          type="number"
          placeholder="Rent"
          className="w-full p-3 border rounded-xl"
          value={data.pricePerMonth}
          onChange={(e) =>
            setData({ ...data, pricePerMonth: e.target.value })
          }
        />
      </section>

      {/* CONFIG */}
      <section className="bg-slate-50 p-6 rounded-xl space-y-6">
        <h2 className="font-bold text-xl flex gap-2">
          <Bed /> Room Setup
        </h2>

        {/* Beds */}
        <div>
          <p>Beds</p>
          <div className="grid grid-cols-4 gap-3">
            {["1", "2", "3", "4+"].map((n) => (
              <TickBox
                key={n}
                label={n}
                selected={data.numBeds === n}
                onClick={() => handleSelect("numBeds", n)}
              />
            ))}
          </div>
        </div>

        {/* Bathroom */}
        <div>
          <p>Bathroom</p>
          {BathroomOptions.map((b) => (
            <TickBox
              key={b}
              label={b}
              icon={Bath}
              selected={data.bathroomType === b}
              onClick={() => handleSelect("bathroomType", b)}
            />
          ))}
        </div>

        {/* Furniture */}
        <div>
          <p>Furniture</p>

          <div className="flex gap-3 flex-wrap">
            {FurnitureOptions.map((f) => (
              <div key={f} className="w-40">
                <TickBox
                  label={f}
                  icon={Armchair}
                  selected={data.furniture.includes(f)}
                  onClick={() => toggleFurniture(f)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UTILITIES */}
      <section className="space-y-6">
        <h2 className="font-bold text-xl flex gap-2">
          <Zap /> Utilities
        </h2>

        {/* Electricity */}
        <div>
          <p>Electricity</p>

          <div className="grid grid-cols-2 gap-3">
            {UtilityOptions.map((u) => (
              <TickBox
                key={u}
                label={u}
                selected={data.currentBill === u}
                onClick={() => handleSelect("currentBill", u)}
              />
            ))}
          </div>
        </div>

        {/* Water */}
        <div>
          <p>Water</p>

          <div className="grid grid-cols-2 gap-3">
            {UtilityOptions.map((u) => (
              <TickBox
                key={u}
                label={u}
                selected={data.waterBill === u}
                onClick={() => handleSelect("waterBill", u)}
              />
            ))}
          </div>
        </div>

        {/* Wifi / Parking / AC */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p>WiFi</p>

            {WifiOptions.map((w) => (
              <TickBox
                key={w}
                label={w}
                icon={Wifi}
                selected={data.wifiType === w}
                onClick={() => handleSelect("wifiType", w)}
              />
            ))}
          </div>

          <div>
            <p>Parking</p>

            {ParkingOptions.map((p) => (
              <TickBox
                key={p}
                label={p}
                icon={Car}
                selected={data.parking === p}
                onClick={() => handleSelect("parking", p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RULES */}
      <section>
        <label className="flex gap-2 font-bold">
          <ShieldAlert /> Rules
        </label>

        <textarea
          rows={4}
          className="w-full p-3 border rounded-xl"
          value={data.houseRules}
          onChange={(e) =>
            setData({ ...data, houseRules: e.target.value })
          }
        />
      </section>
    </div>
  );
};

/* ===============================
   PHOTOS
================================ */

const RoomPhotosSection = ({ photos, setPhotos }) => {
  const ref = useRef(null);

  const upload = (e) => {
    const files = Array.from(e.target.files || []);

    const urls = files.map((f) => URL.createObjectURL(f));

    setPhotos([...photos, ...urls]);
  };

  const remove = (i) => {
    setPhotos(photos.filter((_, idx) => idx !== i));
  };

  return (
    <section className="space-y-6">
      <h2 className="font-bold text-xl">
        Gallery ({photos.length})
      </h2>

      {/* Upload */}
      <div
        onClick={() => ref.current?.click()}
        className="border-dashed border-2 p-10 rounded-xl text-center cursor-pointer"
      >
        <Camera size={40} className="mx-auto mb-2" />
        Click to Upload
      </div>

      <input
        hidden
        multiple
        ref={ref}
        type="file"
        accept="image/*"
        onChange={upload}
      />

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative border rounded-xl overflow-hidden"
          >
            <img src={p} className="w-full h-full object-cover" alt={`Room ${i + 1}`} />

            <button
              onClick={() => remove(i)}
              className="absolute top-2 right-2 bg-white p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {photos.length < 4 &&
          Array.from({ length: 4 - photos.length }).map(
            (_, i) => (
              <div
                key={i}
                className="border-dashed border rounded-xl flex items-center justify-center"
              >
                <ImagePlus />
              </div>
            )
          )}
      </div>
    </section>
  );
};

/* ===============================
   MAIN APP
================================ */

const App = () => {
  const [formData, setFormData] = useState({
    roomTitle: "",
    roomLocation: "",
    roomType: RoomTypes[0],
    category: Categories[0],
    pricePerMonth: "",
    currentBill: UtilityOptions[0],
    waterBill: UtilityOptions[0],
    houseRules: "",

    numBeds: "1",
    bathroomType: BathroomOptions[0],
    furniture: [],
    wifiType: WifiOptions[0],
    parking: ParkingOptions[0],
    airConditioning: AcOptions[0],

    photos: [],
    panorama: null,
  });

  const save = (type) => {
    console.log(type, formData);
    alert(`Saved as ${type}`);
  };

  return (
    <div className="landlord-page-shell">
      <div className="landlord-page-card">
        <Header />

        <div className="landlord-form-card">
          <RoomInfoSection
            data={formData}
            setData={setFormData}
          />

          <PanoramaSection
            panorama={formData.panorama}
            onUpload={(url) => setFormData({ ...formData, panorama: url })}
          />

          <RoomPhotosSection
            photos={formData.photos}
            setPhotos={(p) => setFormData({ ...formData, photos: p })}
          />

          <div className="flex gap-4">
            <button
              onClick={() => save("Publish")}
              className="flex-1 bg-[#004a99] text-white py-3 rounded-xl font-semibold"
            >
              Publish
            </button>

            <button
              onClick={() => save("Draft")}
              className="flex-1 bg-[#e2e8f0] text-[#1e293b] py-3 rounded-xl font-semibold"
            >
              Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
