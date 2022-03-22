<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold">{{ shortDate.day }}</span>
        <span class="mx-1 fs-3">{{ shortDate.month }}</span>
        <span class="mx-2 fs-4 fw-light">{{ shortDate.yearDay }}</span>
      </div>

      <div>
        <button
          v-if="entry.id"
          @click="onDeleteEntry"
          class="btn btn-danger mx-2"
        >
          Delete
          <i class="fa fa-trash-alt"></i>
        </button>

        <input
          v-show="false"
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          ref="imageSelector"
          @change="onSelectedImage"
        />
        <button class="btn btn-primary" @click="onSelectImage">
          Upload picture
          <i class="fa fa-upload"></i>
        </button>
      </div>
    </div>

    <hr />
    <div class="d-flex flex-column px-3 h-75">
      <textarea v-model="entry.text" placeholder="¿Qué sucedió hoy?"></textarea>
    </div>
    <img
      v-if="entry.picture && !localImage"
      :src="entry.picture"
      alt="entry-picture"
      class="img-thumbnail"
    />
    <img
      v-if="localImage"
      :src="localImage"
      alt="entry-picture"
      class="img-thumbnail"
    />

    <Fab icon="fa-save" @on:click="saveEntry" />
  </template>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import getDayMonthYear from "../helpers/getDayMonthYear";
import Swal from "sweetalert2";
import uploadImage from "../helpers/uploadImage";

export default {
  data() {
    return { entry: null, localImage: null, file: null };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Fab: defineAsyncComponent(() => import("../components/Fab.vue")),
  },
  computed: {
    ...mapGetters("journal", ["getEntryById"]),
    shortDate() {
      const { day, month, yearDay } = getDayMonthYear(this.entry.date);
      return { day, month, yearDay };
    },
  },
  watch: {
    id() {
      this.loadEntry();
    },
  },
  methods: {
    ...mapActions("journal", ["updateEntry", "createEntry", "deleteEntry"]),
    loadEntry() {
      this.localImage = null;
      this.file = null;
      let entry;
      if (this.id === "new") {
        entry = {
          text: "",
          date: new Date().getTime(),
        };
      } else {
        entry = this.getEntryById(this.id);
        if (!entry) return this.$router.push({ name: "no-entry-selected" });
      }
      this.entry = entry;
    },
    async saveEntry() {
      new Swal({
        title: "Wait please...",
        allowOutsideClick: false,
      });
      Swal.showLoading();

      if (this.localImage) {
        const picture = await uploadImage(this.file);
        this.entry.picture = picture;
      }

      if (this.entry.id) {
        // update
        await this.updateEntry(this.entry);
      } else {
        // new
        const id = await this.createEntry(this.entry);
        this.$router.push({ name: "entry", params: { id } });
      }

      this.file = null;
      Swal.fire("Saved!", "Entry registered", "success");
    },
    async onDeleteEntry() {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, this cannot be reversed",
        showDenyButton: true,
        confirmButtonText: "Yes, confirm",
      });

      if (isConfirmed) {
        new Swal({
          title: "Wait please...",
          allowOutsideClick: false,
        });
        Swal.showLoading();
        // delete
        await this.deleteEntry(this.entry.id);
        this.$router.push({ name: "entry", params: { id: "new" } });
        Swal.fire("Deleted!", "", "success");
      }
    },
    onSelectedImage(event) {
      const file = event.target.files[0];
      if (!file) {
        this.file = null;
        return;
      }

      this.file = file;

      const fr = new FileReader();
      fr.onload = () => (this.localImage = fr.result);
      fr.readAsDataURL(file);
    },
    onSelectImage() {
      this.$refs.imageSelector.click();
    },
  },
  created() {
    this.loadEntry();
  },
};
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  border: none;
  height: 100%;

  &:focus {
    outline: none;
  }
}

img {
  width: 200px;
  position: fixed;
  bottom: 150px;
  right: 20px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
</style>