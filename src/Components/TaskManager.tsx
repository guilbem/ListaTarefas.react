import { useState, useRef, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string | null;
}

function TaskManager({ session }: { session: Session }) {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editDescriptions, setEditDescriptions] = useState<Record<number, string>>({});
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 mensagens de plugligs
  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // 🔹 upload de imagem
  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("tasks-images").upload(filePath, file);

    if (error) {
      console.error("Erro ao fazer upload:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("tasks-images").getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  // 🔹 inserir novas tarefa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert("Preencha o título e a descrição antes de enviar!");
      return;
    }

    // 🔹  submissao de imagem 
    let imageUrl: string | null = null;

    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    } else {
      imageUrl = ""; 
    }

    const { error } = await supabase.from("tasks").insert({
      title: newTask.title,
      description: newTask.description,
      email: session.user?.email,
      image_url: imageUrl,
    });

    if (error) {
      console.error("Erro ao adicionar tarefa:", error.message);
      return;
    }

    // 🔸 clear no formulário
    setNewTask({ title: "", description: "" });
    setTaskImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    showMessage(" Tarefa Adicionada com sucesso!");
  };


  // 🔹 Consulta tarefas  do usuario logado
  const fetchUserTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("email", session.user.email)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao consultar tarefas:", error.message);
      showMessage(" Erro ao Consultar Tarefas!");
      return;
    }

    setTasks(data || []);
    showMessage(" Tarefas Carregadas com Sucesso!");
  };

  // 🔹 Atualizar tarefas
  const updateTask = async (id: number) => {
    const newDesc = editDescriptions[id];
    if (!newDesc || !newDesc.trim()) {
      alert("Digite uma nova descrição para atualizar!");
      return;
    }

    const { error } = await supabase.from("tasks").update({ description: newDesc }).eq("id", id);

    if (error) {
      console.error("Erro ao atualizar:", error.message);
      return;
    }

    showMessage(" Tarefa Atualizada com Sucesso!");
    setEditDescriptions((prev) => ({ ...prev, [id]: "" }));
    fetchUserTasks(); 
  };

  // 🔹 Excluir tarefa
  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar:", error.message);
      return;
    }

    showMessage(" Tarefa Excluída com Sucesso!");
    fetchUserTasks();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Gerenciador de Projetos</h2>

      {/* 🔹 Mensagem de feedback */}
      {message && (
        <div
          style={{
            backgroundColor: "#e0ffe0",
            color: "#0a0",
            padding: "0.5rem",
            borderRadius: "5px",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <textarea
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "0.5rem" }}
        />

        {/* 🔹 Botoes de adcionar tarefa e Consultar tarefas  */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
             Adicionar Tarefa
          </button>

          <button
            type="button"
            onClick={fetchUserTasks}
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
             Consultar Minhas Tarefas
          </button>
        </div>
      </form>

      {/* Lista tarefas ao clicar em consultar */}
      {tasks.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              {task.image_url && task.image_url !== "" && (
                <img
                  src={task.image_url}
                  alt={task.title}
                  style={{ height: "80px", borderRadius: "6px" }}
                />
              )}

              <div>
                <textarea
                  placeholder="Nova descrição..."
                  value={editDescriptions[task.id] || ""}
                  onChange={(e) =>
                    setEditDescriptions((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => updateTask(task.id)}
                  style={{
                    marginRight: "0.5rem",
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                   Editar Tarefa
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                   Excluir Tarefa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskManager;
