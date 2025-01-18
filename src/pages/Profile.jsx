import { useRef, useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  EditIcon,
  KeyRound,
  LogOut,
  Mail,
  Pen,
  Plus,
  Trash2,
  UserCircle,
  UserRoundPen,
  UserRoundX,
  X,
} from "lucide-react";
import AddContent from "../components/AddContent";
import EditContent from "../components/EditContent";
import DeleteContent from "../components/DeleteContent";
import PropTypes from "prop-types";
import userDefaultImage from "../assets/user_no_background.png";

const maskPassword = (length) => "●".repeat(length);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (user) {
        setUser(user);

        let { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code === "PGRST116") {
          const { data: newProfile, error: insertError } = await supabase
            .from("profile")
            .insert({
              id: user.id,
              is_admin: false,
              name: user.user_metadata.name,
              avatar_url: user.user_metadata.avatar_url,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          profileData = newProfile;
        } else if (profileError) {
          throw profileError;
        }

        setProfile(profileData);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário: ", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setEditedName(user?.user_metadata?.name || "");
      setEditedEmail(user?.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (profile?.avatar_url) {
      setPreviewAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const getMaskedPassword = useCallback(() => {
    const passwordLength = user?.user_metadata?.password_length || 10;
    return maskPassword(passwordLength);
  }, [user]);

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
    if (!isEditingProfile) {
      setEditedName(user?.user_metadata?.name || "");
      setEditedEmail(user?.email || "");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatarUrl(previewUrl);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let avatarUrl = user?.user_metadata?.avatar_url;

      if (editedAvatar) {
        const fileExt = editedAvatar.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        console.log("Iniciando upload de arquivo:", fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, editedAvatar);

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw uploadError;
        }

        console.log("Arquivo enviado com sucesso:", uploadData);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadData.path);

        avatarUrl = publicUrlData.publicUrl;
        console.log("Nova URL do avatar:", avatarUrl);
      }

      console.log("Atualizando usuário com nova URL:", avatarUrl);

      const { data: userData, error: userError } =
        await supabase.auth.updateUser({
          email: editedEmail,
          data: {
            name: editedName,
            avatar_url: avatarUrl,
          },
        });

      if (userError) {
        console.error("Erro ao atualizar usuário:", userError);
        throw userError;
      }

      console.log("Usuário atualizado:", userData);

      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .update({
          name: editedName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (profileError) {
        console.error("Erro ao atualizar perfil:", profileError);
        throw profileError;
      }

      console.log("Perfil atualizado:", profileData);

      setUser(userData.user);
      setProfile(profileData);
      setIsEditingProfile(false);
      setPreviewAvatarUrl("");

      console.log("Estados atualizados. Preview URL:", avatarUrl);

      alert("Perfil atualizado com sucesso!");
      await fetchUserProfile();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        const { error } = await supabase.auth.deleteUser(user.id);
        if (error) throw error;
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir perfil:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const renderContent = () => {
    switch (activeContent) {
    case "add":
      return <AddContent onClose={() => setActiveContent(null)} />;
    case "edit":
      return <EditContent onClose={() => setActiveContent(null)} />;
    case "delete":
      return <DeleteContent onClose={() => setActiveContent(null)} />;
    default:
      return (
        <div className="bg-zinc-950 rounded-lg p-6 mb-8 mx-auto max-w-2xl mt-16">
          <h1 className="text-center font-bold text-2xl mb-8">
            Perfil de {isAdmin ? "Administrador" : "Usuário"}
          </h1>

          <div className="flex flex-col items-center mb-6">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-2">
                <EditableAvatar
                  src={
                    previewAvatarUrl ||
                    profile?.avatar_url ||
                    user?.user_metadata?.avatar_url ||
                    userDefaultImage
                  }
                  isEditing={isEditingProfile}
                  onChange={handleAvatarChange}
                />
              </div>

              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-xl font-semibold  bg-zinc-800 rounded-full indent-4 outline-none py-1 mb-2 border-2 border-red-600"
                />
              ) : (
                <h2 className="text-xl font-semibold text-center">
                  {profile?.name ||
                    user?.user_metadata?.name ||
                    "Nome não definido"}
                </h2>
              )}

              {isEditingProfile ? (
                <div className="flex items-center mt-3">
                  <Mail className="mr-3 text-red-600" />
                  <AutoSizeInput
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="text-sm font-semibold max-width bg-zinc-800 rounded-full outline-none indent-3.5 py-2 mb-2 border-2 border-red-600"
                  />
                </div>
              ) : (
                <InfoItem icon={<Mail />} text={user?.email} />
              )}

              <InfoItem icon={<KeyRound />} text={getMaskedPassword()} />
              <InfoItem
                icon={<Calendar />}
                text={`Conta criada em: ${new Date(
                  user?.created_at
                ).toLocaleDateString("pt-BR")}`}
              />
              {isAdmin && <InfoItem icon={<UserCircle />} text="Admin" />}
            </div>
            <div className="flex justify-center gap-6">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 p-3 rounded-md text-sm font-semibold flex items-center transition-colors duration-300 hover:bg-green-700"
                  >
                    <Check size={20} className="mr-2" /> Salvar
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="bg-red-600 p-3 rounded-md text-sm font-semibold flex items-center transition-colors duration-300 hover:bg-red-700"
                  >
                    <X size={20} className="mr-2" /> Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="bg-green-600 p-3 rounded-md text-sm font-semibold flex items-center transition-colors duration-300 hover:bg-green-700"
                  >
                    <UserRoundPen size={20} className="mr-2" /> Editar informações
                  </button>
                  <button
                    onClick={handleDeleteProfile}
                    className="bg-red-600 p-3 rounded-md text-sm font-semibold flex items-center transition-colors duration-300 hover:bg-red-700"
                  >
                    <UserRoundX size={20} className="mr-2" /> Excluir Conta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-700 p-3 rounded-md text-sm font-semibold flex items-center transition-colors duration-300 hover:bg-red-800"
                  >
                    <LogOut size={20} className="mr-2" />
                    Fazer Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-800 text-white flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  const isAdmin =
    profile?.is_admin || user?.email === "julyane.almeida77@gmail.com";

  return (
    <div className="flex min-h-screen bg-zinc-800 text-white">
      <div className="fixed top-0 left-0 h-full w-60 bg-zinc-950 border-r-2 border-red-600">
        <div className="flex flex-col items-start justify-between mt-12">
          <SidebarButton1
            icon={<EditIcon size={20} />}
            text="Editar Perfil"
            onClick={handleEditToggle}
          />

          {isAdmin && (
            <div className="w-full">
              <SidebarButton1
                icon={
                  isContentExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )
                }
                text={"Conteúdo"}
                onClick={() => setIsContentExpanded(!isContentExpanded)}
              />
              {isContentExpanded && (
                <>
                  <div className="mx-8">
                    <SidebarButton2
                      icon={<Plus size={20} />}
                      text="Adicionar"
                      onClick={() => setActiveContent("add")}
                    />
                    <SidebarButton2
                      icon={<Edit size={20} />}
                      text="Editar"
                      onClick={() => setActiveContent("edit")}
                    />
                    <SidebarButton2
                      icon={<Trash2 size={20} />}
                      text="Deletar"
                      onClick={() => setActiveContent("delete")}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 ml-60 p-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 bg-red-600 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>

        {isAdmin && (
          <>
            {activeModal === "add" && (
              <AddContent onClose={() => setActiveModal(null)} />
            )}
            {activeModal === "edit" && (
              <EditContent onClose={() => setActiveModal(null)} />
            )}
            {activeModal === "delete" && (
              <DeleteContent onClose={() => setActiveModal(null)} />
            )}
          </>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

const SidebarButton1 = ({ icon, text, onClick }) => (
  <button
    className="w-full flex items-center gap-3 px-8 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800"
    onClick={onClick}
  >
    {icon}
    {text}
  </button>
);

SidebarButton1.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const SidebarButton2 = ({ icon, text, onClick }) => (
  <button
    className="w-full flex items-center gap-3 px-6 py-4 font-semibold text-md transition-colors duration-300 hover:text-red-600"
    onClick={onClick}
  >
    {icon}
    {text}
  </button>
);

SidebarButton2.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center mt-3">
    <span className="mr-3 text-red-600">{icon}</span>
    <span>{text}</span>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

const EditableAvatar = ({ src, isEditing, onChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="border-2 border-red-700 rounded-full w-28 h-28 flex items-center justify-center mb-4 cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={src || userDefaultImage}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      {isEditing && (
        <div
          className="absolute bottom-5 right-2 bg-white rounded-md p-1 cursor-pointer"
          onClick={handleClick}
        >
          <Pen size={16} className="text-red-600" strokeWidth={2.5} />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};

EditableAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  onChange: PropTypes.func,
};

const getTextWidth = (text, font) => {
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

const AutoSizeInput = ({ value, onChange, className }) => {
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      const font = window.getComputedStyle(inputRef.current).font;
      const newWidth = getTextWidth(value || "example@email.com", font) + 30;
      setInputWidth(Math.max(newWidth, 200));
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="email"
      value={value}
      onChange={onChange}
      style={{ width: `${inputWidth}px` }}
      className={className}
    />
  );
};

AutoSizeInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Profile;
